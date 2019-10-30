import App, {Container} from "next/app";
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'
const { getUsersCardCollection } = require("../helpers/cardCollectionHelpers");
import firebase from 'firebase/app'
import 'firebase/auth'

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

MyApp.getInitialProps = async ({Component, ctx}) => {
  const user = ctx.req && ctx.req.session ? ctx.req.session.decodedToken : null;
  if(user) {

    const userEbayData = firebase.firestore().collection('userEbayData').doc(user.uid);

    userEbayData.get()
      .then((doc) =>{
        user.ebayData = doc.data()
      })
      .catch((err) =>{
        console.log(err)
      })
  }

  (user) ? ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'user', payload: user }) : '';
  (user) ? ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'usersCardCollction', payload: await getUsersCardCollection(user) }) : '';
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return {pageProps};
}

export default withReduxStore(MyApp)
