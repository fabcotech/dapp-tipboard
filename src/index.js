import React from 'react';
import ReactDOM from 'react-dom';

import { AppComponent } from './App';

import {
  readAllPursesTerm,
  readConfigTerm,
  readPursesDataTerm,
  decodePurses,
} from 'rchain-token';

const DEFAULT_MASTER_REGISTRY_URI_MAINNET = 'xyowz3ncnhnys9krxuuu1kunoyuud8cca16jntmm8xtrkserkcfoek';

const bodyError = (err) => {
  const e = document.createElement('span');
  e.style.color = '#B22';
  e.innerText = err;
  document.body.innerHTML = '';
  document.body.style.background = '#111';
  document.body.appendChild(e);
};

document.addEventListener('DOMContentLoaded', function () {
  if (typeof dappyRChain !== 'undefined') {

    const urlParams = new URLSearchParams(window.location.search)

    let masterRegistryUri ;
    if (urlParams.get('master')) {
      console.log('found master registry URI in parameters', masterRegistryUri)
      masterRegistryUri = urlParams.get('master');
    } else {
      console.log('picking default mainnet / d network master registry URI', DEFAULT_MASTER_REGISTRY_URI_MAINNET)
      masterRegistryUri = DEFAULT_MASTER_REGISTRY_URI_MAINNET
    }
    let contractId = urlParams.get('contract');
    let purseId = urlParams.get('contract') || "index";


    if (!contractId || contractId.length === 0) {
      bodyError(
        'did not find contract id in parameters ?contract=x, length must be 54'
      );
      return;
    }

    if (!purseId || purseId.length === 0) {
      bodyError(
        'did not find purse id in parameters ?contract=x, length must be 54'
      );
      return;
    }

    if (!masterRegistryUri || masterRegistryUri.length !== 54) {
      bodyError(
        'master registry URI is incorrect ?master=x, length must be 54'
      );
      return;
    }
    // Get values from rchain-token contract
    dappyRChain
      .exploreDeploys([
        readConfigTerm({ masterRegistryUri, contractId }),
        readAllPursesTerm({ masterRegistryUri: masterRegistryUri, contractId: contractId }),
        readPursesDataTerm({
          masterRegistryUri: masterRegistryUri,
          pursesIds: ["2"],
          contractId: contractId,
        }),
      ])
      .then((a) => {
        const results = JSON.parse(a).results;

        const config = blockchainUtils.rhoValToJs(
          JSON.parse(results[0].data).expr[0]
        );

        const pursesAsBytes = JSON.parse(results[1].data).expr[0];
        const purses = decodePurses(
          pursesAsBytes,
          blockchainUtils.rhoExprToVar,
          blockchainUtils.decodePar
        );

        let data;
        if (JSON.parse(results[2].data).expr[0]) {
          data = blockchainUtils.rhoValToJs(
            JSON.parse(results[2].data).expr[0]
          );
        }

        if (config.fungible !== true) {
          bodyError(
            'This contract is fungible=true (FT), you need a fungible=false (NFT) contract to use tipboard'
          );
          return;
        }

        if (config.version !== '6.0.0') {
          bodyError('Version should be 6.0.0');
          return;
        }

        const ids = Object.keys(purses);
        // if pursesIds includes '2' it means tha rchain-token has already been depoloyed
        if (ids.includes('2')) {
          // Get values from rchain-token contract
          const values = JSON.parse(decodeURI(data['2']));
          document.title = values.title;
          if (
            typeof values.price === 'number' &&
            typeof values.quantity === 'number' &&
            typeof values.description === 'string' &&
            typeof values.title === 'string'
          ) {
            dappyRChain
              .exploreDeploys([
                readPursesDataTerm({
                  masterRegistryUri,
                  contractId,
                  pursesIds: ids.slice(0, 100),
                }),
              ])
              .then((b) => {
                const results = JSON.parse(b).results;

                let pursesData = {};
                const expr2 = JSON.parse(results[0].data).expr[0];
                if (expr2) {
                  pursesData = blockchainUtils.rhoValToJs(expr2);
                }

                document.getElementById('root').setAttribute('class', 'loaded');
                ReactDOM.render(
                  <AppComponent
                    masterRegistryUri={masterRegistryUri}
                    contractId={contractId}
                    values={values}
                    purses={purses}
                    pursesData={pursesData}
                  ></AppComponent>,
                  document.getElementById('root')
                );
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            bodyError(
              'values must have title, description, price and quantity'
            );
            return;
          }
        } else {
          dappyRChain
            .identify({ publicKey: undefined })
            .then((a) => {
              if (a.identified) {
                if (!a.box) {
                  bodyError(
                    'Need a box for identification, please associate a token box to your account'
                  );
                  return;
                }
                document.getElementById('root').setAttribute('class', 'loaded');
                ReactDOM.render(
                  <AppComponent
                    masterRegistryUri={masterRegistryUri}
                    contractId={contractId}
                    publicKey={a.publicKey}
                    box={a.box}
                    values={undefined}
                    bags={undefined}
                    bagsData={undefined}
                  />,
                  document.getElementById('root')
                );
              } else {
                bodyError('This dapp needs identification');
                console.error('This dapp needs identification');
              }
            })
            .catch((err) => {
              console.log(err);
              bodyError('This dapp needs identification');
              console.error('This dapp needs identification');
            });
        }
      })
      .catch((err) => {
        console.log(err);
        bodyError('Unknown error');
        console.error('error');
      });
  }
});
