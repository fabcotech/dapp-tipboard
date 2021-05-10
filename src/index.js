import React from 'react';
import ReactDOM from 'react-dom';

import { AppComponent } from './App';

import {
  readAllPursesTerm,
  readTerm,
  readPursesDataTerm,
  decodePurses,
} from 'rchain-token';

const bodyError = (err) => {
  const e = document.createElement('span');
  e.style.color = '#B22';
  e.innerText = err;
  document.body.innerHTML = '';
  document.body.style.background = '#111';
  document.body.appendChild(e);
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded');
  if (typeof dappyRChain !== 'undefined') {
    // testnet
    let contractRegistryUri;
    if (window.location.search.startsWith('?contract=')) {
      contractRegistryUri = window.location.search.slice('?contract='.length);
    }

    if (!contractRegistryUri || contractRegistryUri.length !== 54) {
      bodyError(
        'did not find registry URI in parameters ?contract=x, length must be 54'
      );
      return;
    }

    // Get values from rchain-token contract
    dappyRChain
      .exploreDeploys([
        readTerm(contractRegistryUri),
        readAllPursesTerm(contractRegistryUri),
        readPursesDataTerm(contractRegistryUri, { pursesIds: ['3'] }),
      ])
      .then((a) => {
        const results = JSON.parse(a).results;

        const mainValues = blockchainUtils.rhoValToJs(
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

        if (mainValues.fungible !== true) {
          bodyError(
            'This contract is fungible=true, you need a fungible=false contract to use tipboard'
          );
          return;
        }

        if (mainValues.version !== '5.0.3') {
          bodyError('Version should be 5.0.3');
          return;
        }

        const ids = Object.keys(purses);
        // if pursesIds includes '3' it means tha rchain-token has already been depoloyed
        if (ids.includes('3')) {
          // Get values from rchain-token contract
          const values = JSON.parse(decodeURI(data['3']));
          document.title = values.title;
          if (
            typeof values.price === 'number' &&
            typeof values.quantity === 'number' &&
            typeof values.description === 'string' &&
            typeof values.title === 'string'
          ) {
            dappyRChain
              .exploreDeploys([
                readPursesDataTerm(contractRegistryUri, {
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
                    values={values}
                    purses={purses}
                    pursesData={pursesData}
                    registryUri={contractRegistryUri}
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
                    registryUri={contractRegistryUri}
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
