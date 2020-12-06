import React from 'react';
import { createTokensTerm } from 'rchain-token-files';
import {
  mainTerm,
  purchaseTokensTerm,
  readBagsTerm,
  readBagsOrTokensDataTerm,
} from 'rchain-token';

import { GenesisFormComponent } from './GenesisForm';
import { TipBoard } from './TipBoard';

export class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: undefined,
      bags: undefined,
      bagsData: undefined,
    };
  }

  componentDidMount() {
    if (this.props.bags) {
      setInterval(() => {
        dappyRChain
          // shortcut
          .exploreDeploys([
            readBagsTerm(this.props.registryUri),
            readBagsOrTokensDataTerm(this.props.registryUri, 'bags'),
          ])
          .then((a2) => {
            const results2 = JSON.parse(a2).results;
            const bags = blockchainUtils.rhoValToJs(
              JSON.parse(results2[0].data).expr[0]
            );
            const bagsData = blockchainUtils.rhoValToJs(
              JSON.parse(results2[1].data).expr[0]
            );
            this.setState({
              bags: bags,
              bagsData: bagsData,
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

    // deploy a new rchain-token (not rchain-token-files)
    const term = mainTerm(
      blockchainUtils.generateNonce(),
      this.props.publicKey
    ).replace(
      '/*DEFAULT_BAGS*/',
      JSON.stringify({
        0: {
          quantity: payload.quantity,
          price: payload.price,
          nonce: blockchainUtils.generateNonce(),
          publicKey: this.props.publicKey,
          n: '0',
        },
      })
    );

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
                transactions[ids[0]].value.registryUri
              ) {
                resolve(transactions[ids[0]].value);
              } else {
                console.log('result from deploy not found yet');
              }
            }
          }, 4000);
        }).then((mainValues2) => {
          this.setState({ deploying: 3 });
          // deploy just for storing the information of the newly deployed rchain-token (not rchain-token-files)
          // on the already-deployed rchain-token-files contract, in a new bag "0"
          const payloadForTerm = {
            bags: {
              ['0']: {
                price: null,
                quantity: 1,
                n: '0',
                publicKey: this.props.publicKey,
                nonce: blockchainUtils.generateNonce(),
              },
            },
            data: {
              ['0']: encodeURI(
                JSON.stringify({
                  registryUri: mainValues2.registryUri.replace('rho:id:', ''),
                  title: payload.title,
                  description: payload.description,
                })
              ),
            },
            nonce: this.props.nonce,
            newNonce: blockchainUtils.generateNonce(),
          };
          const ba = blockchainUtils.toByteArray(payloadForTerm);
          const term = createTokensTerm(
            this.props.registryUri.replace('rho:id:', ''),
            payloadForTerm,
            'SIGN'
          );
          dappyRChain
            .transaction({
              term: term,
              signatures: {
                SIGN: blockchainUtils.uInt8ArrayToHex(ba),
              },
            })
            .then((a) => {
              this.setState({
                modal: 'values-chosen',
                deploying: undefined,
              });
            });
        });
      });
  };

  onPurchase = (payload) => {
    dappyRChain
      .transaction({
        term: purchaseTokensTerm(this.props.registryUri, {
          price: this.props.bags['0'].price,
          quantity: payload.quantity,
          data: payload.data,
          bagId: '0',
          // It must not be replaced by dappy-cli at compilation
          publicKey: 'PUBLIC' + '_KEY'.substr(0),
          bagNonce: blockchainUtils.generateNonce(),
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

    if (this.state.modal === 'genesis-form') {
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
          onPurchase={this.onPurchase}
          values={this.props.values}
          emojis={this.props.emojis}
          bagsData={this.state.bagsData || this.props.bagsData}
          quantity={this.props.bags['0'].quantity}
          price={this.props.bags['0'].price}
          bags={this.state.bags || this.props.bags}
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
