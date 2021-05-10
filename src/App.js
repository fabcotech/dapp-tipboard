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
    if (this.props.purses) {
      setInterval(() => {
        dappyRChain
          // shortcut
          .exploreDeploys([readAllPursesTerm(this.props.registryUri)])
          .then((a2) => {
            const results2 = JSON.parse(a2).results;
            const pursesAsBytes = JSON.parse(results2[0].data).expr[0];
            const purses = decodePurses(
              pursesAsBytes,
              blockchainUtils.rhoExprToVar,
              blockchainUtils.decodePar
            );

            dappyRChain
              .exploreDeploys([
                readPursesDataTerm(this.props.registryUri, {
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
      purses: {
        ['0']: {
          id: '0',
          publicKey: this.props.publicKey,
          box: this.props.box,
          type: '0',
          quantity: payload.quantity,
          price: payload.price,
        },
        ['1']: {
          id: '1',
          publicKey: this.props.publicKey,
          box: this.props.box,
          type: 'data',
          quantity: 1,
          price: null,
        },
      },
      data: {
        ['0']: null,
        ['1']: encodeURI(
          JSON.stringify({
            title: payload.title,
            description: payload.description,
            price: payload.price,
            quantity: payload.quantity,
          })
        ),
      },
      fromBoxRegistryUri: this.props.box,
    };

    const term = createPursesTerm(this.props.registryUri, payloadCreatePurse);

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
              if (
                transactions[ids[0]].value &&
                transactions[ids[0]].value.status === 'completed'
              ) {
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
        term: purchaseTerm(this.props.registryUri, {
          // save separate purses in box even if same .type and .price Nil
          actionAfterPurchase: 'SAVE_PURSE_SEPARATELY',
          // avoid replacement of dappy cli
          // will be replaced by dappy browser
          toBoxRegistryUri: ['TO_BOX_REGI', 'STRY_URI'].join(''),
          purseId: '2',
          quantity: payload.quantity,
          data: payload.data,
          newId: '', //ignored
          price: this.props.purses['2'].price,
          // avoid replacement of dappy cli
          // will be replaced by dappy browser
          publicKey: 'PUBLIC' + '_KEY'.substr(0),
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
          contractRegistryUri={this.props.registryUri}
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
