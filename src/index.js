import React from "react";
import ReactDOM from "react-dom";

import { AppComponent } from "./App";

let emojisRegistryUri = undefined;
document.addEventListener("DOMContentLoaded", function () {
  if (typeof dappyRChain !== "undefined") {
    // testnet
    if (window.dappy.address.includes("deltanetwork")) {
      emojisRegistryUri = 'stsfzhdxwmma94jrcg3debsjyho615nbagz3jwzwt3x4oa9pwkorzc.index';
      document.body.setAttribute(
        "style",
        `background-image: url("dappy://deltanetwork/${"bmadyako1aq9xoegiy5iayq4mqxykrts8h7i9od1ed5krkfo9s6i4m.index"}");`
      );
      //mainnet
    } else {
      document.body.setAttribute(
        "style",
        `background-image: url("dappy://deltanetwork/${"bmadyako1aq9xoegiy5iayq4mqxykrts8h7i9od1ed5krkfo9s6i4m.index"}");`
        // style + style + `background-image: url("dappy://deltanetwork/${'ks9utbyxmjpcqygp595z5azumhum1otcmh57h9menhqqdb5jn5s57w'.index}");`
      );
    }
    dappyRChain
      // shortcut
      .fetch("dappy://REGISTRY_URI")
      .then((a) => {
        const response = JSON.parse(a);
        const rholangTerm = response.expr[0];
        const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
        /*
          If a file names "values" exists, it means that the ERC-115 has been created,
          we can display the hexagons after having retrieved values and ERC-1155 bags
  
          If it does not exist we must display the form to create it
        */
        console.log(jsValue);
        if (jsValue.files.values) {
          dappyRChain
            // shortcut
            .exploreDeploys("dappy://explore-deploys", [
              /* Get values (rows, columns, price) from the rholang-files-module contract */
              `new return,
                fileCh,
                fileCh,
                filesModuleCh,
                lookup(\`rho:registry:lookup\`) in {
                  lookup!(\`${jsValue.files.values}\`, *fileCh) |
                  for(file <- fileCh) {
                    return!(*file)
                  }
              }`,
              /* Get emojis list */
              `new return, entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {

                lookup!(\`rho:id:${emojisRegistryUri.split('.')[0]}\`, *entryCh) |
      
                for(entry <- entryCh) {
                  new x in {
                    entry!({ "type": "READ" }, *x) |
                    for (y <- x) {
                      new z in {
                        lookup!(*y.get("files").get("${emojisRegistryUri.split('.')[1]}"), *z) |
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
              const values = blockchainUtils.rhoValToJs(
                JSON.parse(results[0].data).expr[0]
              );
              /*
                This process is an entire file (.json), not a string or number
                It needs to be unzipped, see rholang-files-module, read.js script
              */
              const emojisJSONFile = blockchainUtils.rhoValToJs(
                JSON.parse(results[1].data).expr[0]
              );
              let buff;
              try {
                buff = Buffer.from(emojisJSONFile, "base64");
              } catch (err) {
                log(
                  "failed to retreive string from rholang process (.data.expr.ExprString.data), raw value :"
                );
                process.exit();
              }
        
              // pako.inflate returns a UInt8Array
              const unzippedBuffer = Buffer.from(pako.inflate(buff));
              const fileAsString = unzippedBuffer.toString("utf-8");
              const fileAsJson = JSON.parse(fileAsString);
              let emojis = Buffer.from(fileAsJson.data, "base64").toString('utf-8');
              emojis = JSON.parse(emojis).emojis;
              console.log(emojis);

              console.log(
                "files-module .values file retrieved with explore-deploy :"
              );
              console.log(values);

              dappyRChain
                // shortcut
                .exploreDeploys("dappy://explore-deploys", [
                  /* Get all bags from ERC-1155 contract */
                  `new return,
                  entryCh,
                  lookup(\`rho:registry:lookup\`)
                  in {
                    lookup!(\`${values.erc1155RegistryUri}\`, *entryCh) |
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
                    lookup!(\`${values.erc1155RegistryUri}\`, *entryCh) |
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
                  console.log("ERC-1155 bags retrieved with explore-deploy :");
                  console.log(bags);
                  let sold = 0;
                  Object.keys(bags).forEach((bagId) => {
                    if (bagId !== "0") {
                      sold += bags[bagId].quantity;
                    }
                  });
                  let initialQuantity = bags["0"].quantity + sold;

                  const bagsData = blockchainUtils.rhoValToJs(
                    JSON.parse(results2[1].data).expr[0]
                  );
                  console.log(
                    "ERC-1155 bagsData retrieved with explore-deploy :"
                  );
                  console.log(bagsData);
                  console.log("sold", [initialQuantity, sold]);
                  document.title = decodeURI(values.title);
                  document
                    .getElementById("root")
                    .setAttribute("class", "loaded");
                  ReactDOM.render(
                    <AppComponent
                      values={{
                        ...values,
                        sold: [initialQuantity, sold],
                      }}
                      bags={bags}
                      bagsData={bagsData}
                      emojis={emojis}
                      erc1155RegistryUri={values.erc1155RegistryUri}
                    ></AppComponent>,
                    document.getElementById("root")
                  );
                });
            });
        } else {
          document.getElementById("root").setAttribute("class", "loaded");
          ReactDOM.render(
            <AppComponent
              nonce={jsValue.nonce}
              values={undefined}
              bags={undefined}
              bagsData={undefined}
            />,
            document.getElementById("root")
          );
        }
      })
      .catch((err) => {
        console.error(
          "Something went wrong when retreiving the files module object"
        );
        console.log(err);
      });
  }
});
