(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{"/aHj":function(t,e,n){e.f=n("G1Wo")},"0lY0":function(t,e,n){"use strict";var r=n("2jw7"),o=n("Q8jq"),a=n("fZVS"),i=n("0T/a"),u=n("IxLI"),s=n("YndH").KEY,c=n("14Ie"),f=n("d3Kl"),p=n("wNhr"),l=n("ewAR"),h=n("G1Wo"),v=n("/aHj"),y=n("CgoH"),b=n("0tY/"),d=n("taoM"),m=n("D4ny"),g=n("b4pn"),O=n("AYVP"),w=n("aput"),j=n("LqFA"),S=n("+EWW"),E=n("cQhG"),P=n("Vl3p"),x=n("Ym6j"),_=n("McIs"),N=n("OtwA"),M=n("djPm"),k=x.f,A=N.f,F=P.f,Y=r.Symbol,C=r.JSON,D=C&&C.stringify,I=h("_hidden"),K=h("toPrimitive"),H={}.propertyIsEnumerable,q=f("symbol-registry"),W=f("symbols"),T=f("op-symbols"),V=Object.prototype,L="function"==typeof Y&&!!_.f,J=r.QObject,G=!J||!J.prototype||!J.prototype.findChild,Q=a&&c(function(){return 7!=E(A({},"a",{get:function(){return A(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=k(V,e);r&&delete V[e],A(t,e,n),r&&t!==V&&A(V,e,r)}:A,Z=function(t){var e=W[t]=E(Y.prototype);return e._k=t,e},X=L&&"symbol"==typeof Y.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof Y},R=function(t,e,n){return t===V&&R(T,e,n),m(t),e=j(e,!0),m(n),o(W,e)?(n.enumerable?(o(t,I)&&t[I][e]&&(t[I][e]=!1),n=E(n,{enumerable:S(0,!1)})):(o(t,I)||A(t,I,S(1,{})),t[I][e]=!0),Q(t,e,n)):A(t,e,n)},z=function(t,e){m(t);for(var n,r=b(e=w(e)),o=0,a=r.length;a>o;)R(t,n=r[o++],e[n]);return t},B=function(t){var e=H.call(this,t=j(t,!0));return!(this===V&&o(W,t)&&!o(T,t))&&(!(e||!o(this,t)||!o(W,t)||o(this,I)&&this[I][t])||e)},U=function(t,e){if(t=w(t),e=j(e,!0),t!==V||!o(W,e)||o(T,e)){var n=k(t,e);return!n||!o(W,e)||o(t,I)&&t[I][e]||(n.enumerable=!0),n}},$=function(t){for(var e,n=F(w(t)),r=[],a=0;n.length>a;)o(W,e=n[a++])||e==I||e==s||r.push(e);return r},tt=function(t){for(var e,n=t===V,r=F(n?T:w(t)),a=[],i=0;r.length>i;)!o(W,e=r[i++])||n&&!o(V,e)||a.push(W[e]);return a};L||(u((Y=function(){if(this instanceof Y)throw TypeError("Symbol is not a constructor!");var t=l(arguments.length>0?arguments[0]:void 0),e=function(n){this===V&&e.call(T,n),o(this,I)&&o(this[I],t)&&(this[I][t]=!1),Q(this,t,S(1,n))};return a&&G&&Q(V,t,{configurable:!0,set:e}),Z(t)}).prototype,"toString",function(){return this._k}),x.f=U,N.f=R,n("2HZK").f=P.f=$,n("1077").f=B,_.f=tt,a&&!n("tFdt")&&u(V,"propertyIsEnumerable",B,!0),v.f=function(t){return Z(h(t))}),i(i.G+i.W+i.F*!L,{Symbol:Y});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;et.length>nt;)h(et[nt++]);for(var rt=M(h.store),ot=0;rt.length>ot;)y(rt[ot++]);i(i.S+i.F*!L,"Symbol",{for:function(t){return o(q,t+="")?q[t]:q[t]=Y(t)},keyFor:function(t){if(!X(t))throw TypeError(t+" is not a symbol!");for(var e in q)if(q[e]===t)return e},useSetter:function(){G=!0},useSimple:function(){G=!1}}),i(i.S+i.F*!L,"Object",{create:function(t,e){return void 0===e?E(t):z(E(t),e)},defineProperty:R,defineProperties:z,getOwnPropertyDescriptor:U,getOwnPropertyNames:$,getOwnPropertySymbols:tt});var at=c(function(){_.f(1)});i(i.S+i.F*at,"Object",{getOwnPropertySymbols:function(t){return _.f(O(t))}}),C&&i(i.S+i.F*(!L||c(function(){var t=Y();return"[null]"!=D([t])||"{}"!=D({a:t})||"{}"!=D(Object(t))})),"JSON",{stringify:function(t){for(var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);if(n=e=r[1],(g(e)||void 0!==t)&&!X(t))return d(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!X(e))return e}),r[1]=e,D.apply(C,r)}}),Y.prototype[K]||n("jOCL")(Y.prototype,K,Y.prototype.valueOf),p(Y,"Symbol"),p(Math,"Math",!0),p(r.JSON,"JSON",!0)},"0tY/":function(t,e,n){var r=n("djPm"),o=n("McIs"),a=n("1077");t.exports=function(t){var e=r(t),n=o.f;if(n)for(var i,u=n(t),s=a.f,c=0;u.length>c;)s.call(t,i=u[c++])&&e.push(i);return e}},"2HZK":function(t,e,n){var r=n("JpU4"),o=n("ACkF").concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},"4mXO":function(t,e,n){t.exports=n("Vphk")},Bqhj:function(t,e,n){"use strict";var r=n("q1tI"),o=n.n(r).a.createElement;e.a=function(t){var e=t.email,n=t.password,r=t.handleChange,a=t.handleEmailPassAuth,i=t.errorMessage;return o("form",{onSubmit:a},i&&o("div",null,i),o("div",null,o("input",{type:"email",placeholder:"Email",value:e,name:"email",onChange:r,required:!0})),o("div",null,o("input",{type:"password",placeholder:"Password",value:n,name:"password",onChange:r,required:!0})),o("div",null,o("input",{type:"submit"})))}},CgoH:function(t,e,n){var r=n("2jw7"),o=n("p9MR"),a=n("tFdt"),i=n("/aHj"),u=n("OtwA").f;t.exports=function(t){var e=o.Symbol||(o.Symbol=a?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||u(e,t,{value:i.f(t)})}},"Go+2":function(t,e,n){"use strict";var r={childContextTypes:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},o={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a=Object.defineProperty,i=Object.getOwnPropertyNames,u=Object.getOwnPropertySymbols,s=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,f=c&&c(Object);t.exports=function t(e,n,p){if("string"!==typeof n){if(f){var l=c(n);l&&l!==f&&t(e,l,p)}var h=i(n);u&&(h=h.concat(u(n)));for(var v=0;v<h.length;++v){var y=h[v];if(!r[y]&&!o[y]&&(!p||!p[y])){var b=s(n,y);try{a(e,y,b)}catch(d){}}}return e}return e}},"Jo+v":function(t,e,n){t.exports=n("KgSv")},KgSv:function(t,e,n){n("STjA");var r=n("p9MR").Object;t.exports=function(t,e){return r.getOwnPropertyDescriptor(t,e)}},Qebf:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/[lang]/login",function(){var t=n("aqZc");return{page:t.default||t}}])},STjA:function(t,e,n){var r=n("aput"),o=n("Ym6j").f;n("wWUK")("getOwnPropertyDescriptor",function(){return function(t,e){return o(r(t),e)}})},Vl3p:function(t,e,n){var r=n("aput"),o=n("2HZK").f,a={}.toString,i="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return i&&"[object Window]"==a.call(t)?function(t){try{return o(t)}catch(e){return i.slice()}}(t):o(r(t))}},Vphk:function(t,e,n){n("0lY0"),t.exports=n("p9MR").Object.getOwnPropertySymbols},Ym6j:function(t,e,n){var r=n("1077"),o=n("+EWW"),a=n("aput"),i=n("LqFA"),u=n("Q8jq"),s=n("pH/F"),c=Object.getOwnPropertyDescriptor;e.f=n("fZVS")?c:function(t,e){if(t=a(t),e=i(e,!0),s)try{return c(t,e)}catch(n){}if(u(t,e))return o(!r.f.call(t,e),t[e])}},YndH:function(t,e,n){var r=n("ewAR")("meta"),o=n("b4pn"),a=n("Q8jq"),i=n("OtwA").f,u=0,s=Object.isExtensible||function(){return!0},c=!n("14Ie")(function(){return s(Object.preventExtensions({}))}),f=function(t){i(t,r,{value:{i:"O"+ ++u,w:{}}})},p=t.exports={KEY:r,NEED:!1,fastKey:function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!a(t,r)){if(!s(t))return"F";if(!e)return"E";f(t)}return t[r].i},getWeak:function(t,e){if(!a(t,r)){if(!s(t))return!0;if(!e)return!1;f(t)}return t[r].w},onFreeze:function(t){return c&&p.NEED&&s(t)&&!a(t,r)&&f(t),t}}},YvMK:function(t,e,n){"use strict";var r=Object.prototype.hasOwnProperty;function o(t,e){return t===e?0!==t||0!==e||1/t===1/e:t!==t&&e!==e}t.exports=function(t,e){if(o(t,e))return!0;if("object"!==typeof t||null===t||"object"!==typeof e||null===e)return!1;var n=Object.keys(t),a=Object.keys(e);if(n.length!==a.length)return!1;for(var i=0;i<n.length;i++)if(!r.call(e,n[i])||!o(t[n[i]],e[n[i]]))return!1;return!0}},aqZc:function(t,e,n){"use strict";n.r(e);var r=n("ln6h"),o=n.n(r),a=n("O40h"),i=n("zrwo"),u=n("MX0m"),s=n.n(u),c=n("q1tI"),f=n.n(c),p=n("Wcq6"),l=n.n(p),h=(n("6nsN"),n("hmoh")),v=n.n(h),y=n("JwBy"),b=n("nOHt"),d=n.n(b),m=n("eHHv"),g=n("Bqhj"),O=n("D9KS"),w=n("/MKj"),j=f.a.createElement,S=Object(m.a)(Object(m.b)("state","setState",{email:"",password:"",isLoading:!1,errorMessage:""}))(function(t){var e=t.setState,n=t.state,r=t.dispatch,u=t.lang;l.a.apps.length||l.a.initializeApp(v.a);var f=n.email,p=n.password,h=n.isLoading,b=n.errorMessage;function m(t,r){var o=Object(i.a)({},n);o[t]=r,e(o)}var w=function(){var t=Object(a.a)(o.a.mark(function t(e){return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e&&e.uid&&(r({type:"SET_ITEM",name:"user",payload:e}),d.a.push("/".concat(u,"/dashboard")));case 1:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}();return Object(c.useEffect)(function(){var t=l.a.auth().onAuthStateChanged(w);return function(){return t()}}),j(y.a,{pageMod:"about"},j("h1",{className:"jsx-2762284588"},"Login page"),j("p",{className:"jsx-2762284588"},"Login page content"),j("div",{className:"jsx-2762284588 login-form-wrapper"},j("div",{className:"jsx-2762284588 login-form"},j(g.a,{errorMessage:b,email:f,password:p,handleEmailPassAuth:function(t){t.preventDefault(),m("isLoading",!0);var e=n.email,r=n.password;l.a.auth().signInWithEmailAndPassword(e,r).catch(function(t){var e=t.code,n=t.message;m("isLoading",!1),"auth/user-not-found"===e&&(n="User not found please register"),m("errorMessage",n)})},handleChange:function(t){var r=Object(i.a)({},n);r[t.target.name]=t.target.value,e(r)}}),j("div",{className:"jsx-2762284588"},j("button",{className:"jsx-2762284588"},"Sign In with Google"))),j(O.a,{isLoading:h})),j(s.a,{id:"2762284588"},[".login-form-wrapper.jsx-2762284588{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:50px;position:relative;}"]))});e.default=Object(w.b)(function(t){return t})(S)},eHHv:function(t,e,n){"use strict";var r=n("q1tI");function o(){return(o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}n("YvMK");function a(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e}function i(){var t=this.constructor.getDerivedStateFromProps(this.props,this.state);null!==t&&void 0!==t&&this.setState(t)}function u(t){this.setState(function(e){var n=this.constructor.getDerivedStateFromProps(t,e);return null!==n&&void 0!==n?n:null}.bind(this))}function s(t,e){try{var n=this.props,r=this.state;this.props=t,this.state=e,this.__reactInternalSnapshotFlag=!0,this.__reactInternalSnapshot=this.getSnapshotBeforeUpdate(n,r)}finally{this.props=n,this.state=r}}i.__suppressDeprecationWarning=!0,u.__suppressDeprecationWarning=!0,s.__suppressDeprecationWarning=!0;n("Go+2");var c=n("xmmm"),f=n("bCCX");n.d(e,"b",function(){return p}),n.d(e,"a",function(){return h});Object.keys;var p=function(t,e,n){return function(i){var u=Object(r.createFactory)(i);return function(r){function i(){for(var t,e=arguments.length,o=new Array(e),a=0;a<e;a++)o[a]=arguments[a];return(t=r.call.apply(r,[this].concat(o))||this).state={stateValue:"function"===typeof n?n(t.props):n},t.updateStateValue=function(e,n){return t.setState(function(t){var n=t.stateValue;return{stateValue:"function"===typeof e?e(n):e}},n)},t}return a(i,r),i.prototype.render=function(){var n;return u(o({},this.props,((n={})[t]=this.state.stateValue,n[e]=this.updateStateValue,n)))},i}(r.Component)}};r.Component;var l,h=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.reduce(function(t,e){return function(){return t(e.apply(void 0,arguments))}},function(t){return t})},v={fromESObservable:null,toESObservable:null},y={fromESObservable:function(t){return"function"===typeof v.fromESObservable?v.fromESObservable(t):t},toESObservable:function(t){return"function"===typeof v.toESObservable?v.toESObservable(t):t}};l=y},vYYK:function(t,e,n){"use strict";n.d(e,"a",function(){return a});var r=n("hfKm"),o=n.n(r);function a(t,e,n){return e in t?o()(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},xmmm:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.createChangeEmitter=function(){var t=[],e=t;function n(){e===t&&(e=t.slice())}return{listen:function(t){if("function"!==typeof t)throw new Error("Expected listener to be a function.");var r=!0;return n(),e.push(t),function(){if(r){r=!1,n();var o=e.indexOf(t);e.splice(o,1)}}},emit:function(){for(var n=t=e,r=0;r<n.length;r++)n[r].apply(n,arguments)}}}},zrwo:function(t,e,n){"use strict";n.d(e,"a",function(){return f});var r=n("Jo+v"),o=n.n(r),a=n("4mXO"),i=n.n(a),u=n("pLtp"),s=n.n(u),c=n("vYYK");function f(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?Object(arguments[e]):{},r=s()(n);"function"===typeof i.a&&(r=r.concat(i()(n).filter(function(t){return o()(n,t).enumerable}))),r.forEach(function(e){Object(c.a)(t,e,n[e])})}return t}}},[["Qebf",1,0]]]);