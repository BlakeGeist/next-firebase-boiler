import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../credentials/client'

class Dashbaord extends React.Component {
  static async getInitialProps({ reduxStore, req, query }) {
    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };
    const isServer = !!req
    const user = req && req.session ? req.session.decodedToken : null;

    const messagesCollection = firebase.firestore().collection("messages")
    await messagesCollection.get()
      .then((snap) =>{
        const messages = snap.docs.map(d => d.data());
        if(messages){
          reduxStore.dispatch({ type: 'SET_ITEM', name: 'messages', payload: messages });
        }
        if(user){
          //reduxStore.dispatch({ type: 'SET_ITEM', name: 'user', payload: user });
        }
      })
      .catch((err) => {
        console.log(err)
      })
    return { isServer };
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    return (
      <Layout>
        <h1>Dashbaord page</h1>
      </Layout>
      )
  }
}

export default connect(state => state)(Dashbaord);
