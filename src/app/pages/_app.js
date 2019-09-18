import App, {Container} from "next/app";
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import clientCredentials from '../credentials/client'

class MyApp extends App {

  static async getInitialProps({Component, ctx}) {

    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };

    const user = ctx.req && ctx.req.session ? ctx.req.session.decodedToken : null;

    const messagesCollection = firebase.firestore().collection("messages")
    await messagesCollection.get()
      .then((snap) =>{
        const messages = snap.docs.map(d => d.data());
        if(messages){
          //reduxStore.dispatch({ type: 'SET_ITEM', name: 'messages', payload: messages });
        }
        if(user){
          ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'user', payload: user });
          console.log('@@@@@@')
          console.log(user)
        }
      })
      .catch((err) => {
        console.log(err)
      })

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return {pageProps};

  }

  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
