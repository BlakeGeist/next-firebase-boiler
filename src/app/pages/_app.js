import React from "react";
import withReduxStore from "../lib/reducers";
import { Provider } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import clientCredentials from "../credentials/client";
if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
};
const db = firebase.app().firestore();

const MyApp = ({ Component, pageProps, reduxStore }) => {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const headers = ctx.req.headers;
  const userRegionLang = headers["accept-language"].split(",")[0].split("-");
  const userLang = userRegionLang[0];
  const userRegion = userRegionLang[1].toLowerCase();

  if(ctx.asPath === '/'){
    ctx.res.redirect(`/${userLang}`);
  }
  
  const pathWithoutLang = ctx.asPath.replace(`/${ctx.query.lang}/`, "").replace("/","-");
  const usersRef = db.collection("strings").doc("global");

  await usersRef.get()
    .then(async (docSnapshot) => {
      if (docSnapshot.exists) {
        let pageStrings = db.collection("strings").doc(pathWithoutLang).collection("strings");
        await pageStrings.get()
          .then(snap =>{
            pageStrings = snap.docs.map(d => {
              return {
                [d.id]: d.data()
              };
            });
            const objectizedStrings = Object.assign({}, ...pageStrings);
            ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "pageStrings", payload:  objectizedStrings});
          })
          .catch(e => {
          });
      } else {
      }
  });

  const usersRef2 = db.collection("strings").doc("global");

  await usersRef2.get()
    .then(async (docSnapshot) => {
      if (docSnapshot.exists) {
        let strings = db.collection("strings").doc("global").collection("strings");
        await strings.get()
          .then(snap =>{
            strings = snap.docs.map(d => {
              return {
                [d.id]: d.data()
              };
            });
            const objectizedStrings = Object.assign({}, ...strings);
            ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "strings", payload:  objectizedStrings});
          })
          .catch(e => {
          });
      } else {
      }
});
  const user = ctx.req && ctx.req.session ? ctx.req.session.decodedToken : null;
  
  (user) ? ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "user", payload: user }) : "";
  (user) ? ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "isLoggedIn", payload: true }) : "";
  ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "lang", payload: ctx.query.lang });
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return {pageProps};
};

export default withReduxStore(MyApp);
