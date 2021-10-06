import React from 'react';
import ReactDOM from 'react-dom';

import { AppComponent } from './App';

import {
  readAllPursesTerm,
  readConfigTerm,
  readPursesDataTerm,
  decodePurses,
} from 'rchain-token';

const DEFAULT_MASTER_REGISTRY_URI_MAINNET =
  'afjrah43mg5486tt4yweju9nshbhwhg9zumz4g4gxu4b8uwhced9gz';

const bodyError = (err) => {
  const e = document.createElement('p');
  e.style.color = '#B22';
  e.style.fontWeight = '400';
  e.style.fontSize = '1.8rem';
  e.innerText = err;
  const e2 = document.createElement('p');
  e2.innerText = `URL should have the following structure : tips?contract=myftcontract\n
If you are using tips on a secondary network, also reference the master registry uri &master=aaabbb`;
  e2.style.color = '#B22';
  e2.style.fontWeight = '400';
  e2.style.fontSize = '1.1rem';
  e2.style.paddingTop = '10px';
  document.body.innerHTML = '';
  document.body.style.background = '#111';
  document.body.style.padding = '20px';
  document.body.appendChild(e);
  document.body.appendChild(e2);
};

document.addEventListener('DOMContentLoaded', function () {
  if (typeof dappyRChain !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);

    let masterRegistryUri;
    if (urlParams.get('master')) {
      console.log(
        'found master registry URI in parameters',
        urlParams.get('master')
      );
      masterRegistryUri = urlParams.get('master');
    } else {
      console.log(
        'picking default mainnet / d network master registry URI',
        DEFAULT_MASTER_REGISTRY_URI_MAINNET
      );
      masterRegistryUri = DEFAULT_MASTER_REGISTRY_URI_MAINNET;
    }
    let contractId = urlParams.get('contract');

    if (!contractId || contractId.length === 0) {
      bodyError(
        'did not find contract id in parameters ?contract=x, length must be 54'
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
        readAllPursesTerm({
          masterRegistryUri: masterRegistryUri,
          contractId: contractId,
          depth: 2,
        }),
        readPursesDataTerm({
          masterRegistryUri: masterRegistryUri,
          pursesIds: ['2', '1'],
          contractId: contractId,
        }),
      ])
      .then((a) => {
        const results = JSON.parse(a).results;

        const expr0 = JSON.parse(results[0].data).expr[0];
        const expr1 = JSON.parse(results[1].data).expr[0];
        const expr2 = JSON.parse(results[2].data).expr[0];
        if (!expr0) {
          bodyError(
            `Contract not found, are you sure contract ${contractId} exists ?`
          );
          return;
        }
        const config = blockchainUtils.rhoValToJs(expr0);

        let purses = {};
        if (expr1) {
          purses = decodePurses(
            expr1,
            blockchainUtils.rhoExprToVar,
            blockchainUtils.decodePar
          );
        }

        let data;
        if (expr2) {
          data = blockchainUtils.rhoValToJs(expr2);
        }

        if (config.fungible !== true) {
          bodyError(
            'This contract is fungible=false (NFT), you need a fungible=true (FT) contract to use tipboard'
          );
          return;
        }

        if (config.version !== '12.0.1') {
          bodyError('Version should be 12.0.1');
          return;
        }

        const ids = Object.keys(purses);
        // the data should be on one of those two purses
        let dataId = undefined;
        if (ids.includes('1') && data['1']) {
          dataId = '1';
        } else if (ids.includes('2') && data['2']) {
          dataId = '2';
        }
        // if dataId is string
        if (typeof dataId === 'string') {
          const purseToPurchaseFrom = ['1', '2'].find(
            (id) => typeof purses[id].price === 'number'
          );
          // Get values from rchain-token contract
          const values = JSON.parse(decodeURI(data[dataId]));
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
                const exprData = JSON.parse(results[0].data).expr[0];
                if (exprData) {
                  pursesData = blockchainUtils.rhoValToJs(exprData);
                }

                document.getElementById('root').setAttribute('class', 'loaded');
                ReactDOM.render(
                  <AppComponent
                    masterRegistryUri={masterRegistryUri}
                    contractId={contractId}
                    values={values}
                    purseToPurchaseFrom={purseToPurchaseFrom}
                    purseForData={purseToPurchaseFrom === '1' ? '2' : '1'}
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
