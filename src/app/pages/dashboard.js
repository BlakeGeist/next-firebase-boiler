import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../credentials/client'
import Messages from '../components/Messages';
import Router from 'next/router';


class Dashbaord extends React.Component {
  static async getInitialProps({ reduxStore, req, query, res }) {
    const { user } = reduxStore.getState();

    if(res && !user.email){
      res.redirect('/login')
    } else if(!user.email){
      Router.push('/login')
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };
    const isServer = !!req
    const messagesCollection = firebase.firestore().collection("messages")
    await messagesCollection.get()
      .then((snap) =>{
        const messages = snap.docs.map(d => d.data());
        if(messages){
          reduxStore.dispatch({ type: 'SET_ITEM', name: 'messages', payload: messages });
        }
      })
      .catch((err) => {
        console.log(err)
      })
    return { isServer };
  }

  render () {
    const {user} = this.props;
    return (
      <Layout isAuthedRequired={true}>
        <h1>Dashbaord page</h1>
        <h2>User Info</h2>
        <div>
          <p>Email: {user.email}</p>
        </div>
        <h2>Messages</h2>
        <Messages />
      </Layout>
      )
  }
}

export default connect(state => state)(Dashbaord);
