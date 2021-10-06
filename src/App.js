import React from 'react';
import {
  readAllPursesTerm,
  readPursesDataTerm,
  createPursesTerm,
  purchaseTerm,
  decodePurses,
} from 'rchain-token';

import { GenesisFormComponent } from './GenesisForm';
import { TipBoard } from './TipBoard';

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: undefined,
      purses: undefined,
      pursesData: undefined,
    };
  }

  componentDidMount() {
    console.log('did mount');
    console.log(this.props);
    if (this.props.purses) {
      setInterval(() => {
        dappyRChain
          // shortcut
          .exploreDeploys([
            readAllPursesTerm({
              masterRegistryUri: this.props.masterRegistryUri,
              contractId: this.props.contractId,
              depth: 2,
            }),
          ])
          .then((a2) => {
            const results2 = JSON.parse(a2).results;
            const pursesAsBytes = JSON.parse(results2[0].data).expr[0];
            const purses = decodePurses(
              pursesAsBytes,
              blockchainUtils.rhoExprToVar,
              blockchainUtils.decodePar
            );
            console.log('App purses', purses);

            dappyRChain
              .exploreDeploys([
                readPursesDataTerm({
                  masterRegistryUri: this.props.masterRegistryUri,
                  contractId: this.props.contractId,
                  pursesIds: Object.keys(purses),
                }),
              ])
              .then((b) => {
                const results = JSON.parse(b).results;
                let pursesData = {};
                const expr1 = JSON.parse(results[0].data).expr[0];
                if (expr1) {
                  pursesData = blockchainUtils.rhoValToJs(expr1);
                }
                console.log('App pursesData', pursesData);

                this.setState({
                  purses: purses,
                  pursesData: pursesData,
                });
              });
          });
      }, 15000);
    }
  }
  onValuesChosen = (payload) => {
    this.setState({ deploying: 1 });
    if (typeof dappyRChain === 'undefined') {
      console.warn(
        'window.dappyRChain is undefined, cannot deploy rchain-token'
      );
      return;
    }

    const payloadCreatePurse = {
      masterRegistryUri: this.props.masterRegistryUri,
      contractId: this.props.contractId,
      boxId: this.props.box,
      purses: {
        ['1']: {
          id: '', // will be set by rholang
          boxId: this.props.box,
          quantity: payload.quantity,
          price: payload.price,
        },
        ['2']: {
          id: '', // will be set by rholang
          boxId: this.props.box,
          quantity: 1,
          price: null,
        },
      },
      data: {
        ['1']: null,
        ['2']: encodeURI(
          JSON.stringify({
            title: payload.title,
            description: payload.description,
            price: payload.price,
            quantity: payload.quantity,
          })
        ),
      },
    };

    const term = createPursesTerm(payloadCreatePurse);

    dappyRChain
      .transaction({
        term: term,
        signatures: {},
      })
      .then((a) => {
        this.setState({ deploying: 2 });
        new Promise((resolve, reject) => {
          setInterval(() => {
            const transactions = dappyStore.getState().transactions;
            const ids = Object.keys(transactions);
            if (ids.length) {
              const found = ids.find((id) => {
                return (
                  transactions[id].value &&
                  transactions[id].value.status === 'completed'
                );
              });
              if (found) {
                resolve(transactions[ids[0]].value);
              } else {
                console.log('result from deploy not found yet');
              }
            }
          }, 4000);
        }).then((mainValues2) => {
          this.setState({
            modal: 'values-chosen',
            deploying: undefined,
          });
        });
      });
  };

  onPurchase = (payload) => {
    dappyRChain
      .transaction({
        term: purchaseTerm({
          masterRegistryUri: this.props.masterRegistryUri,
          contractId: this.props.contractId,
          purseId: this.props.purseToPurchaseFrom,
          // avoid replacement of dappy cli
          // will be replaced by dappy browser
          boxId: ['BOX_', 'ID'].join(''),
          quantity: payload.quantity,
          data: payload.data,
          merge: false,
          newId: '', // will be set by rholang
          price: this.props.purses[this.props.purseToPurchaseFrom].price,
          // avoid replacement of dappy cli
          // will be replaced by dappy browser
          publicKey: ['PUBLIC', '_KEY'].join(''),
        }),
        signatures: {},
      })
      .then((a) => {
        this.setState({
          modal: 'purchase',
        });
      });
  };

  render() {
    if (this.state.deploying) {
      return (
        <div>
          <p>
            <br />
            <br />
            <br />
            <br />
            Now deploying contracts ({this.state.deploying}/3), please do not
            refresh or close tab
          </p>
        </div>
      );
    }
    if (this.state.modal === 'purchase') {
      return (
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Purchase successful</p>
              <button
                onClick={() => this.setState({ modal: undefined })}
                className="delete"
                aria-label="close"
              ></button>
            </header>
            <section className="modal-card-body">
              Transaction was successfully sent. Wait few minutes and you should
              see your contribution.
            </section>
            <footer className="modal-card-foot">
              <button
                onClick={() => this.setState({ modal: undefined })}
                class="button"
              >
                Ok
              </button>
            </footer>
          </div>
        </div>
      );
    }

    if (this.state.modal === 'values-chosen') {
      return (
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Submit successful</p>
              <button
                onClick={() => this.setState({ modal: undefined })}
                className="delete"
                aria-label="close"
              ></button>
            </header>
            <section className="modal-card-body">
              Submit was successful, wait few minutes, reload, and the
              rchain-token contract should be initiated.
            </section>
            <footer className="modal-card-foot">
              <button
                onClick={() => this.setState({ modal: undefined })}
                class="button"
              >
                Ok
              </button>
            </footer>
          </div>
        </div>
      );
    }
    if (this.props.values) {
      return (
        <TipBoard
          masterRegistryUri={this.props.masterRegistryUri}
          purseToPurchaseFrom={this.props.purseToPurchaseFrom}
          purseForData={this.props.purseForData}
          contractId={this.props.contractId}
          onPurchase={this.onPurchase}
          values={this.props.values}
          emojis={this.props.emojis}
          pursesData={this.state.pursesData || this.props.pursesData}
          purses={this.state.purses || this.props.purses}
        ></TipBoard>
      );
    }

    return (
      <GenesisFormComponent
        onValuesChosen={this.onValuesChosen}
      ></GenesisFormComponent>
    );
  }
}
