import App, {Container} from "next/app";
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import "firebase/firestore"
import Router from 'next/router'

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

MyApp.getInitialProps = async ({ Component, ctx }) => {

  const pathWithoutLang = ctx.asPath.replace(`/${ctx.query.lang}/`, '')


  var pageStrings = db.collection("strings").doc(pathWithoutLang).collection('strings')

  await pageStrings.get()
    .then(snap =>{
      pageStrings = snap.docs.map(d => {
        return {
          [d.id]: d.data()
        }
      });
      const objectizedStrings = Object.assign({}, ...pageStrings)
      ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'pageStrings', payload:  objectizedStrings});
    })
    .catch(e => {
      console.log('err', e)
    })

  var strings = db.collection("strings").doc('global').collection('strings')
  await strings.get()
    .then(snap =>{
      strings = snap.docs.map(d => {
        return {
          [d.id]: d.data()
        }
      });
      const objectizedStrings = Object.assign({}, ...strings)
      ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'strings', payload:  objectizedStrings});
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
