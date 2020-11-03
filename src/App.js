import React from "react";
import { erc1155Term, purchaseTokensTerm } from "rchain-erc1155";

import { GenesisFormComponent } from "./GenesisForm";
import { TipBoard } from "./TipBoard";

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
          .exploreDeploys("dappy://explore-deploys", [
            /* Get all bags from ERC-1155 contract */
            `new return,
          entryCh,
          lookup(\`rho:registry:lookup\`)
          in {
            lookup!(\`${this.props.values.erc1155RegistryUri}\`, *entryCh) |
            for(entry <- entryCh) {
              entry!(
                {
                  "type": "READ_BAGS",
                },
                *return
              )
            }
          }`,
            `new return,
          entryCh,
          lookup(\`rho:registry:lookup\`)
          in {
            lookup!(\`${this.props.values.erc1155RegistryUri}\`, *entryCh) |
            for(entry <- entryCh) {
              entry!(
                {
                  "type": "READ_BAGS_DATA",
                },
                *return
              )
            }
          }`,
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
    if (typeof dappyRChain === "undefined") {
      console.warn("window.dappyRChain is undefined, cannot deploy ERC1155");
      return;
    }

    /*
      token will be created by default in the deployment of the ERC-1155 contract
    */
    let defaultBags = `"0": { "publicKey": "${
      "PUBLIC" +
      "_KEY".substr(0) /* It must not be replaced by dappy-cli at compilation*/
    }", "n": "0", "price": ${payload.price}, "quantity": ${payload.quantity} }`;

    const nonceForErc1155Term = blockchainUtils.generateNonce();
    const nonceForFilesModule = blockchainUtils.generateNonce();

    const erc1155ContractTerm = erc1155Term(
      nonceForErc1155Term,
      "PUBLIC" + "_KEY".substr(0) // It must not be replaced by dappy-cli at compilation
    );

    /*
      Add tokens by default in the contract
    */
    const erc1155TermWithDefaultBags = erc1155ContractTerm.replace(
      "/*DEFAULT_BAGS*/",
      defaultBags
    );
    /*
      When the ERC-1155 contract is created, we must record the values in the
      files module
    */
    const erc1155TermWithDefaultBagsAndReturnChannel = erc1155TermWithDefaultBags.replace(
      "/*OUTPUT_CHANNEL*/",
      `| erc1155OutputCh!({
        "registryUri": *entryUri,
      })`
    );

    // Storing the registry URI value in the files module
    const term = `
   new entryCh, erc1155OutputCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {

     ${erc1155TermWithDefaultBagsAndReturnChannel} |

     for (@output <- erc1155OutputCh) { 
       stdout!({
         "quantity": ${payload.quantity},
         "price": ${payload.price},
         "title": "${payload.title}",
         "description": "${payload.description}",
         "erc1155RegistryUri": output.get("registryUri"),
       }) |

       lookup!(\`rho:id:REGISTRY_URI\`, *entryCh) |
     
       for(entry <- entryCh) {
         entry!(
           {
             "type": "ADD",
             "payload": {
               "id": "values",
               "file": {
                "quantity": ${payload.quantity},
                "price": ${payload.price},
                "title": "${payload.title}",
                "description": "${payload.description}",
                 "erc1155RegistryUri": output.get("registryUri"),
               },
               "nonce": "${nonceForFilesModule}",
               "signature": "SIGNATURE"
             }
           },
           *stdout
         )
       }
     }
   }
   `;
    dappyRChain
      .transaction({
        term: term,
        signatures: {
          SIGNATURE: payload.nonce,
        },
      })
      .then((a) => {
        this.setState({
          modal: "values-chosen",
        });
      });
  };

  onPurchase = (payload) => {
    dappyRChain
      .transaction({
        term: purchaseTokensTerm(
          this.props.erc1155RegistryUri.replace("rho:id:", ""),
          "0",
          this.props.values.price,
          payload.data,
          payload.quantity,
          // It must not be replaced by dappy-cli at compilation
          "PUBLIC" + "_KEY".substr(0),
          blockchainUtils.generateNonce()
        ),
        signatures: {},
      })
      .then((a) => {
        this.setState({
          modal: "purchase",
        });
      });
  };

  render() {
    if (this.state.modal === "purchase") {
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
              Transaction was successfully sent. Wait few minutes, reload, and
              you should see your cell with the color you chose. Thank you for
              your participation.
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

    if (this.state.modal === "genesis-form") {
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
              Submit was successful, wait few minutes, reload, and the ERC-1155
              contract should be initiated.
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
          max={this.props.bags["0"].quantity}
          bags={this.state.bags || this.props.bags}
        ></TipBoard>
      );
    }

    return (
      <GenesisFormComponent
        onValuesChosen={this.onValuesChosen}
        nonce={this.props.nonce}
      ></GenesisFormComponent>
    );
  }
}
