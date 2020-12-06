import React from 'react';
import ReactDOM from 'react-dom';

import { AppComponent } from './App';

import {
  readBagsOrTokensDataTerm as readBagsOrTokensDataTerm2,
  read,
} from 'rchain-token-files';
import { readBagsOrTokensDataTerm, readBagsTerm } from 'rchain-token';

let emojisRegistryUri = undefined;
document.addEventListener('DOMContentLoaded', function () {
  if (typeof dappyRChain !== 'undefined') {
    // testnet
    if (window.dappy.address.includes('deltanetwork')) {
      emojisRegistryUri =
        'stsfzhdxwmma94jrcg3debsjyho615nbagz3jwzwt3x4oa9pwkorzc.index';
      // mainnet
    } else {
      emojisRegistryUri =
        'wo5icxdekdtapssxx5bx4jbfu6cn689spf4gjserzcw6mga9p8itdk.index';
    }

    // Get values from rchain-token-files contract
    dappyRChain
      .exploreDeploys([
        read('REGISTRY_URI'),
        readBagsOrTokensDataTerm2('REGISTRY_URI', 'bags'),
        /* Get emojis list */
        `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {

        lookup!(\`rho:id:${emojisRegistryUri.split('.')[0]}\`, *entryCh) |

        for(entry <- entryCh) {
          new x in {
            entry!({ "type": "READ" }, *x) |
            for (y <- x) {
              new z in {
                lookup!(*y.get("files").get("${
                  emojisRegistryUri.split('.')[1]
                }"), *z) |
                for (value <- z) {
                  return!(*value)
                }
              }
            }
          }
        }
      }`,
      ])
      .then((a) => {
        const results = JSON.parse(a).results;

        const mainValues = blockchainUtils.rhoValToJs(
          JSON.parse(results[0].data).expr[0]
        );

        const bagsData = blockchainUtils.rhoValToJs(
          JSON.parse(results[1].data).expr[0]
        );

        /*
        This process is an entire file (.json), not a string or number
        It needs to be unzipped, see rholang-files-module, read.js script
      */
        let buff;
        let emojis = {};
        try {
          const emojisJSONFile = blockchainUtils.rhoValToJs(
            JSON.parse(results[2].data).expr[0]
          );
          buff = Buffer.from(emojisJSONFile, 'base64');
          const unzippedBuffer = Buffer.from(pako.inflate(buff));
          const fileAsString = unzippedBuffer.toString('utf-8');
          const fileAsJson = JSON.parse(fileAsString);
          const emojisString = Buffer.from(fileAsJson.data, 'base64').toString(
            'utf-8'
          );
          emojis = JSON.parse(emojisString).emojis;
        } catch (err) {
          console.log(err);
          console.log(
            'failed to retreive emojis (.data.expr.ExprString.data), raw value :'
          );
        }

        // if bagsData['0'] it means tha rchain-token has already been depoloyed
        if (bagsData['0']) {
          // Get values from rchain-token contract
          const values = JSON.parse(decodeURI(bagsData['0']));
          document.title = values.title;
          if (
            typeof values.registryUri === 'string' &&
            typeof values.description === 'string' &&
            typeof values.title === 'string'
          ) {
            dappyRChain
              .exploreDeploys([
                readBagsTerm(values.registryUri),
                readBagsOrTokensDataTerm(values.registryUri, 'bags'),
              ])
              .then((b) => {
                const results = JSON.parse(b).results;
                const bags2 = blockchainUtils.rhoValToJs(
                  JSON.parse(results[0].data).expr[0]
                );
                const bagsData2 = blockchainUtils.rhoValToJs(
                  JSON.parse(results[1].data).expr[0]
                );

                document.getElementById('root').setAttribute('class', 'loaded');
                ReactDOM.render(
                  <AppComponent
                    values={values}
                    bags={bags2}
                    bagsData={bagsData2}
                    emojis={emojis}
                    registryUri={values.registryUri}
                  ></AppComponent>,
                  document.getElementById('root')
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            console.error(
              'values must have title, description and registryUri'
            );
          }
        } else {
          dappyRChain
            .identify({ publicKey: undefined })
            .then((a) => {
              if (a.identified) {
                document.getElementById('root').setAttribute('class', 'loaded');
                ReactDOM.render(
                  <AppComponent
                    registryUri={mainValues.registryUri}
                    nonce={mainValues.nonce}
                    publicKey={a.publicKey}
                    nonce={mainValues.nonce}
                    values={undefined}
                    bags={undefined}
                    bagsData={undefined}
                  />,
                  document.getElementById('root')
                );
              } else {
                console.error('This dapp needs identification');
              }
            })
            .catch((err) => {
              console.log(err);
              console.error('This dapp needs identification');
            });
        }
      })
      .catch((err) => {
        console.log(err);
        console.error('error');
      });
  }
});
