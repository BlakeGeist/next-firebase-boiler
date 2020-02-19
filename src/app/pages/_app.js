import App, {Container} from "next/app";
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../../functions/credentials/client'

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials)
};

const MyApp = ({ Component, pageProps, reduxStore }) => {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  )
}

MyApp.getInitialProps = async ({Component, ctx, query}) => {
  const user = ctx.req && ctx.req.session ? ctx.req.session.decodedToken : null;
  (user) ? ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'user', payload: user }) : '';
  const lang = query
  console.log(ctx.query.lang)
  ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'lang', payload: ctx.query.lang });
  return lang
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return {pageProps};
}

export default withReduxStore(MyApp)
