(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{"4mXO":function(t,e,n){t.exports=n("7TPF")},"7TPF":function(t,e,n){n("AUvm"),t.exports=n("WEpk").Object.getOwnPropertySymbols},Bqhj:function(t,e,n){"use strict";var r=n("q1tI"),a=n.n(r).a.createElement;e.a=function(t){var e=t.email,n=t.password,r=t.handleChange,o=t.handleEmailPassAuth,i=t.errorMessage;return a("form",{onSubmit:o},i&&a("div",null,i),a("div",null,a("input",{type:"email",placeholder:"Email",value:e,name:"email",onChange:r,required:!0})),a("div",null,a("input",{type:"password",placeholder:"Password",value:n,name:"password",onChange:r,required:!0})),a("div",null,a("input",{type:"submit"})))}},"Go+2":function(t,e,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},a={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},o=Object.defineProperty,i=Object.getOwnPropertyNames,s=Object.getOwnPropertySymbols,u=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,p=c&&c(Object);t.exports=function t(e,n,l){if("string"!==typeof n){if(p){var f=c(n);f&&f!==p&&t(e,f,l)}var v=i(n);s&&(v=v.concat(s(n)));for(var h=0;h<v.length;++h){var d=v[h];if(!r[d]&&!a[d]&&(!l||!l[d])){var b=u(n,d);try{o(e,d,b)}catch(g){}}}return e}return e}},"Jo+v":function(t,e,n){t.exports=n("/eQG")},Qebf:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/[lang]/login",function(){var t=n("aqZc");return{page:t.default||t}}])},YvMK:function(t,e,n){"use strict";var r=Object.prototype.hasOwnProperty;function a(t,e){return t===e?0!==t||0!==e||1/t===1/e:t!==t&&e!==e}t.exports=function(t,e){if(a(t,e))return!0;if("object"!==typeof t||null===t||"object"!==typeof e||null===e)return!1;var n=Object.keys(t),o=Object.keys(e);if(n.length!==o.length)return!1;for(var i=0;i<n.length;i++)if(!r.call(e,n[i])||!a(t[n[i]],e[n[i]]))return!1;return!0}},aqZc:function(t,e,n){"use strict";n.r(e);var r=n("ln6h"),a=n.n(r),o=n("O40h"),i=n("zrwo"),s=n("MX0m"),u=n.n(s),c=n("q1tI"),p=n.n(c),l=n("Wcq6"),f=n.n(l),v=(n("6nsN"),n("hmoh")),h=n.n(v),d=n("JwBy"),b=n("nOHt"),g=n.n(b),m=n("eHHv"),y=n("Bqhj"),O=n("D9KS"),w=n("/MKj"),j=p.a.createElement,x=Object(m.a)(Object(m.b)("state","setState",{email:"",password:"",isLoading:!1,errorMessage:""}))(function(t){var e=t.setState,n=t.state,r=t.dispatch,s=t.lang;f.a.apps.length||f.a.initializeApp(h.a);var p=n.email,l=n.password,v=n.isLoading,b=n.errorMessage;function m(t,r){var a=Object(i.a)({},n);a[t]=r,e(a)}var w=function(){var t=Object(o.a)(a.a.mark(function t(e){return a.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e&&e.uid&&(r({type:"SET_ITEM",name:"user",payload:e}),g.a.push("/".concat(s,"/dashboard")));case 1:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}();return Object(c.useEffect)(function(){var t=f.a.auth().onAuthStateChanged(w);return function(){return t()}}),j(d.a,{pageMod:"about"},j("h1",{className:"jsx-2762284588"},"Login page"),j("p",{className:"jsx-2762284588"},"Login page content"),j("div",{className:"jsx-2762284588 login-form-wrapper"},j("div",{className:"jsx-2762284588 login-form"},j(y.a,{errorMessage:b,email:p,password:l,handleEmailPassAuth:function(t){t.preventDefault(),m("isLoading",!0);var e=n.email,r=n.password;f.a.auth().signInWithEmailAndPassword(e,r).catch(function(t){var e=t.code,n=t.message;m("isLoading",!1),"auth/user-not-found"===e&&(n="User not found please register"),m("errorMessage",n)})},handleChange:function(t){var r=Object(i.a)({},n);r[t.target.name]=t.target.value,e(r)}}),j("div",{className:"jsx-2762284588"},j("button",{className:"jsx-2762284588"},"Sign In with Google"))),j(O.a,{isLoading:v})),j(u.a,{id:"2762284588"},[".login-form-wrapper.jsx-2762284588{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:50px;position:relative;}"]))});e.default=Object(w.b)(function(t){return t})(x)},eHHv:function(t,e,n){"use strict";var r=n("q1tI");function a(){return(a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}n("YvMK");function o(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}function i(){var t=this.constructor.getDerivedStateFromProps(this.props,this.state);null!==t&&void 0!==t&&this.setState(t)}function s(t){this.setState(function(e){var n=this.constructor.getDerivedStateFromProps(t,e);return null!==n&&void 0!==n?n:null}.bind(this))}function u(t,e){try{var n=this.props,r=this.state;this.props=t,this.state=e,this.__reactInternalSnapshotFlag=!0,this.__reactInternalSnapshot=this.getSnapshotBeforeUpdate(n,r)}finally{this.props=n,this.state=r}}i.__suppressDeprecationWarning=!0,s.__suppressDeprecationWarning=!0,u.__suppressDeprecationWarning=!0;n("Go+2");var c=n("xmmm"),p=n("bCCX");n.d(e,"b",function(){return l}),n.d(e,"a",function(){return v});Object.keys;var l=function(t,e,n){return function(i){var s=Object(r.createFactory)(i);return function(r){function i(){for(var t,e=arguments.length,a=new Array(e),o=0;o<e;o++)a[o]=arguments[o];return(t=r.call.apply(r,[this].concat(a))||this).state={stateValue:"function"===typeof n?n(t.props):n},t.updateStateValue=function(e,n){return t.setState(function(t){var n=t.stateValue;return{stateValue:"function"===typeof e?e(n):e}},n)},t}return o(i,r),i.prototype.render=function(){var n;return s(a({},this.props,((n={})[t]=this.state.stateValue,n[e]=this.updateStateValue,n)))},i}(r.Component)}};r.Component;var f,v=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.reduce(function(t,e){return function(){return t(e.apply(void 0,arguments))}},function(t){return t})},h={fromESObservable:null,toESObservable:null},d={fromESObservable:function(t){return"function"===typeof h.fromESObservable?h.fromESObservable(t):t},toESObservable:function(t){return"function"===typeof h.toESObservable?h.toESObservable(t):t}};f=d},vYYK:function(t,e,n){"use strict";n.d(e,"a",function(){return o});var r=n("hfKm"),a=n.n(r);function o(t,e,n){return e in t?a()(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},xmmm:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.createChangeEmitter=function(){var t=[],e=t;function n(){e===t&&(e=t.slice())}return{listen:function(t){if("function"!==typeof t)throw new Error("Expected listener to be a function.");var r=!0;return n(),e.push(t),function(){if(r){r=!1,n();var a=e.indexOf(t);e.splice(a,1)}}},emit:function(){for(var n=t=e,r=0;r<n.length;r++)n[r].apply(n,arguments)}}}},zrwo:function(t,e,n){"use strict";n.d(e,"a",function(){return p});var r=n("Jo+v"),a=n.n(r),o=n("4mXO"),i=n.n(o),s=n("pLtp"),u=n.n(s),c=n("vYYK");function p(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?Object(arguments[e]):{},r=u()(n);"function"===typeof i.a&&(r=r.concat(i()(n).filter(function(t){return a()(n,t).enumerable}))),r.forEach(function(e){Object(c.a)(t,e,n[e])})}return t}}},[["Qebf",1,0]]]);