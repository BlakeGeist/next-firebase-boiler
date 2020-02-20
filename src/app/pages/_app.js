import App, {Container} from "next/app";
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import "firebase/firestore";

import clientCredentials from '../../functions/credentials/client'
if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials)
};
const db = firebase.app().firestore();

const MyApp = ({ Component, pageProps, reduxStore }) => {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  )
}

MyApp.getInitialProps = async ({Component, ctx, query}) => {

  var strings = db.collection("strings")

  await strings.get()
    .then(snap =>{
      strings = snap.docs.map(d => {
        return {
          name: d.id,
          strings: d.data()
        }
      });
      ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'strings', payload: strings });
    })
    .catch(e => {
      console.log('err', e)
    })

  const user = ctx.req && ctx.req.session ? ctx.req.session.decodedToken : null;
  (user) ? ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'user', payload: user }) : '';
  ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'lang', payload: ctx.query.lang });
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return {pageProps};
}

export default withReduxStore(MyApp)
