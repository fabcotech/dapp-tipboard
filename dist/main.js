!function(e){var t={};function a(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=t,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="",a(a.s=3)}([function(e,t){e.exports=React},function(e,t){e.exports=RChainToken},function(e,t){e.exports=ReactDOM},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(2),s=a.n(o),i=a(1),l=new Intl.NumberFormat("en-US",{maximumFractionDigits:8});function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function p(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=b(e);if(t){var r=b(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return m(this,a)}}function m(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?y(e):t}function y(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var v=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(s,e);var t,a,n,o=d(s);function s(){var e;u(this,s);for(var t=arguments.length,a=new Array(t),n=0;n<t;n++)a[n]=arguments[n];return h(y(e=o.call.apply(o,[this].concat(a))),"state",{title:"Help me buy a sword !",description:"",price:1e8,quantity:1e3}),e}return t=s,(a=[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"genesis-form form"},r.a.createElement("div",{id:"canvas"}),r.a.createElement("p",null,"Hi ! The tipping board has not been initialized yet. Choose a price per token, choose the quantity of tokens you want to create. And eventually title and description.",r.a.createElement("br",null),r.a.createElement("br",null),"By default one token equals one REV and 1000 tokens are created for the tip board. Fill free to change the values. Remember that 1 REV equals 100.000.000 dusts.",r.a.createElement("br",null),r.a.createElement("br",null)),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Title"),r.a.createElement("div",{className:"control"},r.a.createElement("input",{defaultValue:this.state.title,onInput:function(t){return e.setState({title:t.target.value})},className:"input",type:"text"}))),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Description"),r.a.createElement("div",{className:"control"},r.a.createElement("textarea",{className:"textarea",onInput:function(t){e.setState({description:t.target.value})},defaultValue:this.state.description}))),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Price for each token (dust)"),r.a.createElement("div",{className:"control"},r.a.createElement("input",{defaultValue:this.state.price,onInput:function(t){return e.setState({price:parseInt(t.target.value)})},className:"input",type:"number",min:1,step:1}))),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Quantity of tokens"),r.a.createElement("div",{className:"control"},r.a.createElement("input",{defaultValue:this.state.quantity,onChange:function(t){return e.setState({quantity:parseInt(t.target.value)})},className:"input",type:"number",min:1,step:1})),this.state&&this.state.price&&this.state.quantity&&this.state.title?r.a.createElement("p",null,"Total REV :"," ",l.format(this.state.price*this.state.quantity/1e8)," ",r.a.createElement("br",null),"Total dust (1 REV equals 100.000.000 dust):"," ",l.format(this.state.price*this.state.quantity)," "):void 0),r.a.createElement("div",{className:"field"},r.a.createElement("br",null),r.a.createElement("button",{className:"button is-light",disabled:!(this.state&&this.state.price&&this.state.quantity&&this.state.title),type:"button",onClick:function(t){e.state&&e.state.price&&e.state.quantity&&e.state.title&&e.props.onValuesChosen({price:e.state.price,quantity:e.state.quantity,title:e.state.title,description:e.state.description})}},"Save values and create tipping board !")))}}])&&p(t.prototype,a),n&&p(t,n),s}(r.a.Component);function E(e){return(E="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function g(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function N(e,t){return(N=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function O(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=j(e);if(t){var r=j(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return S(this,a)}}function S(e,t){return!t||"object"!==E(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function j(e){return(j=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var R=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&N(e,t)}(s,e);var t,a,n,o=O(s);function s(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),(t=o.call(this,e)).state={quantity:0,name:"",emoji:void 0,displayEmojis:!1},t}return t=s,(a=[{key:"render",value:function(){for(var e=this,t=this.props.purses[2],a=JSON.parse(decodeURI(this.props.pursesData[3])),n=!t||0===t.quantity,o=Object.keys(this.props.purses).filter((function(t){return"2"!==t&&"0"===e.props.purses[t].type})).sort((function(e,t){return e<t?1:-1})),s=Object.keys(this.props.purses),i=0,c=1;c<s.length;c+=1)"2"!==s[c]&&"0"===this.props.purses[s[c]].type&&(i+=this.props.purses[s[c]].quantity);var u=a.quantity;return r.a.createElement("div",{className:"tip-board"},r.a.createElement("h3",{className:"title is-3"},this.props.values.title),this.props.values.description&&r.a.createElement("p",{className:"description"},this.props.values.description),n&&r.a.createElement("p",null,"All tokens are sold !"),r.a.createElement("p",null,i," out of ",u," tokens sold (",Math.round(100*i/u),"%)"),r.a.createElement("p",null,t?r.a.createElement("span",null,t.quantity," tokens are for sale at a price of"," ",l.format(t.price/1e8)," REV per token"):void 0),r.a.createElement("br",null),!n&&r.a.createElement("div",{className:"contribution-form"},r.a.createElement("div",{className:"cell-form"},r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Quantity to purchase"),r.a.createElement("div",{className:"control"},r.a.createElement("input",{defaultValue:this.state.quantity,onInput:function(t){return e.setState({quantity:parseInt(t.target.value)})},className:"input",type:"number",min:1,step:1,max:this.props.max}))),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Name"),r.a.createElement("div",{className:"control"},r.a.createElement("input",{defaultValue:this.state.name,onInput:function(t){return e.setState({name:t.target.value})},className:"input",type:"text"}),this.state.emoji?r.a.createElement("span",{className:"label-emoji"},this.state.emoji):void 0)),r.a.createElement("div",{className:"field"},r.a.createElement("label",{className:"label"},"Total price"),r.a.createElement("div",null,r.a.createElement("span",{className:"total-price"},r.a.createElement("b",null,l.format(this.state.quantity*t.price/1e8))," REV"),r.a.createElement("br",null),this.state.quantity*t.price<1e8&&r.a.createElement("span",{className:"total-price"},r.a.createElement("b",null,l.format(this.state.quantity*t.price))," dusts"))),r.a.createElement("div",{className:"field"},r.a.createElement("br",null),r.a.createElement("button",{className:"button is-light",disabled:!this.state.quantity,type:"button",onClick:function(t){var a={name:e.state.name};e.state.emoji&&(a.emoji=e.state.emoji),a=encodeURI(JSON.stringify(a)),e.state.quantity&&e.props.onPurchase({quantity:e.state.quantity,data:a})}},"Tip !")))),r.a.createElement("div",{className:"tips"},r.a.createElement("p",null,o.length," contributions :"),o.map((function(t){var n;try{n=JSON.parse(decodeURI(e.props.pursesData[t]))}catch(e){return console.log(e),r.a.createElement("p",{key:t,className:""},"Unable to parse")}return r.a.createElement("p",{key:t},r.a.createElement("b",{className:"name"},e.props.pursesData[t]?n.name:"Anonymous")," ",r.a.createElement("span",null,"tipped"),r.a.createElement("b",{className:"amount"},l.format(e.props.purses[t].quantity*a.price/1e8)," ","REV"))}))))}}])&&g(t.prototype,a),n&&g(t,n),s}(r.a.Component);function w(e){return(w="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function k(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function x(e,t){return(x=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function P(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=_(e);if(t){var r=_(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return T(this,a)}}function T(e,t){return!t||"object"!==w(t)&&"function"!=typeof t?q(e):t}function q(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _(e){return(_=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function I(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var C=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&x(e,t)}(s,e);var t,a,n,o=P(s);function s(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),I(q(t=o.call(this,e)),"onValuesChosen",(function(e){var a,n;if(t.setState({deploying:1}),"undefined"!=typeof dappyRChain){var r={purses:(a={},I(a,"0",{id:"0",publicKey:t.props.publicKey,type:"0",quantity:e.quantity,price:e.price}),I(a,"1",{id:"1",publicKey:t.props.publicKey,type:"data",quantity:1,price:null}),a),data:(n={},I(n,"0",null),I(n,"1",encodeURI(JSON.stringify({title:e.title,description:e.description,price:e.price,quantity:e.quantity}))),n),fromBoxRegistryUri:t.props.box},o=Object(i.createPursesTerm)(t.props.registryUri,r);dappyRChain.transaction({term:o,signatures:{}}).then((function(e){t.setState({deploying:2}),new Promise((function(e,t){setInterval((function(){var t=dappyStore.getState().transactions,a=Object.keys(t);a.length&&(t[a[0]].value&&"completed"===t[a[0]].value.status?e(t[a[0]].value):console.log("result from deploy not found yet"))}),4e3)})).then((function(e){t.setState({modal:"values-chosen",deploying:void 0})}))}))}else console.warn("window.dappyRChain is undefined, cannot deploy rchain-token")})),I(q(t),"onPurchase",(function(e){dappyRChain.transaction({term:Object(i.purchaseTerm)(t.props.registryUri,{actionAfterPurchase:"SAVE_PURSE_SEPARATELY",toBoxRegistryUri:["TO_BOX_REGI","STRY_URI"].join(""),purseId:"2",quantity:e.quantity,data:e.data,newId:"",price:t.props.purses[2].price,publicKey:"PUBLIC"+"_KEY".substr(0)}),signatures:{}}).then((function(e){t.setState({modal:"purchase"})}))})),t.state={modal:void 0,purses:void 0,pursesData:void 0},t}return t=s,(a=[{key:"componentDidMount",value:function(){var e=this;this.props.purses&&setInterval((function(){dappyRChain.exploreDeploys([Object(i.readPursesIdsTerm)(e.props.registryUri)]).then((function(t){var a=JSON.parse(t).results,n=blockchainUtils.rhoValToJs(JSON.parse(a[0].data).expr[0]);dappyRChain.exploreDeploys([Object(i.readPursesTerm)(e.props.registryUri,{pursesIds:n}),Object(i.readPursesDataTerm)(e.props.registryUri,{pursesIds:n})]).then((function(t){var a=JSON.parse(t).results,n={},r=JSON.parse(a[0].data).expr[0];r&&(n=blockchainUtils.rhoValToJs(r));var o={},s=JSON.parse(a[1].data).expr[0];s&&(o=blockchainUtils.rhoValToJs(s)),e.setState({purses:n,pursesData:o})}))}))}),15e3)}},{key:"render",value:function(){var e=this;return this.state.deploying?r.a.createElement("div",null,r.a.createElement("p",null,r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("br",null),"Now deploying contracts (",this.state.deploying,"/3), please do not refresh or close tab")):"purchase"===this.state.modal?r.a.createElement("div",{className:"modal"},r.a.createElement("div",{className:"modal-background"}),r.a.createElement("div",{className:"modal-card"},r.a.createElement("header",{className:"modal-card-head"},r.a.createElement("p",{className:"modal-card-title"},"Purchase successful"),r.a.createElement("button",{onClick:function(){return e.setState({modal:void 0})},className:"delete","aria-label":"close"})),r.a.createElement("section",{className:"modal-card-body"},"Transaction was successfully sent. Wait few minutes and you should see your contribution."),r.a.createElement("footer",{className:"modal-card-foot"},r.a.createElement("button",{onClick:function(){return e.setState({modal:void 0})},class:"button"},"Ok")))):"values-chosen"===this.state.modal?r.a.createElement("div",{className:"modal"},r.a.createElement("div",{className:"modal-background"}),r.a.createElement("div",{className:"modal-card"},r.a.createElement("header",{className:"modal-card-head"},r.a.createElement("p",{className:"modal-card-title"},"Submit successful"),r.a.createElement("button",{onClick:function(){return e.setState({modal:void 0})},className:"delete","aria-label":"close"})),r.a.createElement("section",{className:"modal-card-body"},"Submit was successful, wait few minutes, reload, and the rchain-token contract should be initiated."),r.a.createElement("footer",{className:"modal-card-foot"},r.a.createElement("button",{onClick:function(){return e.setState({modal:void 0})},class:"button"},"Ok")))):this.props.values?r.a.createElement(R,{onPurchase:this.onPurchase,values:this.props.values,emojis:this.props.emojis,pursesData:this.state.pursesData||this.props.pursesData,purses:this.state.purses||this.props.purses}):r.a.createElement(v,{onValuesChosen:this.onValuesChosen})}}])&&k(t.prototype,a),n&&k(t,n),s}(r.a.Component),U=function(e){var t=document.createElement("span");t.style.color="#B22",t.innerText=e,document.body.innerHTML="",document.body.style.background="#111",document.body.appendChild(t)};document.addEventListener("DOMContentLoaded",(function(){if("undefined"!=typeof dappyRChain){var e;if(window.location.search.startsWith("?contract=")&&(e=window.location.search.slice("?contract=".length)),!e||54!==e.length)return void U("did not find registry URI in parameters ?contract=x, length must be 54");dappyRChain.exploreDeploys([Object(i.readTerm)(e),Object(i.readPursesIdsTerm)(e),Object(i.readPursesDataTerm)(e,{pursesIds:["3"]})]).then((function(t){var a,n=JSON.parse(t).results,o=blockchainUtils.rhoValToJs(JSON.parse(n[0].data).expr[0]),l=blockchainUtils.rhoValToJs(JSON.parse(n[1].data).expr[0]);if(JSON.parse(n[2].data).expr[0]&&(a=blockchainUtils.rhoValToJs(JSON.parse(n[2].data).expr[0])),!0===o.fungible)if("5.0.0"===o.version)if(l.includes("3")){var c=JSON.parse(decodeURI(a[3]));if(document.title=c.title,"number"!=typeof c.price||"number"!=typeof c.quantity||"string"!=typeof c.description||"string"!=typeof c.title)return void U("values must have title, description, price and quantity");dappyRChain.exploreDeploys([Object(i.readPursesTerm)(e,{pursesIds:l}),Object(i.readPursesDataTerm)(e,{pursesIds:l})]).then((function(t){var a=JSON.parse(t).results,n={},o=JSON.parse(a[0].data).expr[0];o&&(n=blockchainUtils.rhoValToJs(o));var i={},l=JSON.parse(a[1].data).expr[0];l&&(i=blockchainUtils.rhoValToJs(l)),document.getElementById("root").setAttribute("class","loaded"),s.a.render(r.a.createElement(C,{values:c,purses:n,pursesData:i,registryUri:e}),document.getElementById("root"))})).catch((function(e){console.log(e)}))}else dappyRChain.identify({publicKey:void 0}).then((function(t){if(t.identified){if(!t.box)return void U("Need a box for identification, please associate a token box to your account");document.getElementById("root").setAttribute("class","loaded"),s.a.render(r.a.createElement(C,{registryUri:e,publicKey:t.publicKey,box:t.box,values:void 0,bags:void 0,bagsData:void 0}),document.getElementById("root"))}else U("This dapp needs identification"),console.error("This dapp needs identification")})).catch((function(e){console.log(e),U("This dapp needs identification"),console.error("This dapp needs identification")}));else U("Version should be 5.0.0");else U("This contract is fungible=true, you need a fungible=false contract to use tipboard")})).catch((function(e){console.log(e),U("Unknown error"),console.error("error")}))}}))}]);