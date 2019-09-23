import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../functions/credentials/client'
import Messages from '../components/Messages';
import Router from 'next/router';

const Dashbaord = ({ user }) => {
  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
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

Dashbaord.getInitialProps = async ({reduxStore, req, query, res}) => {
  const { user } = reduxStore.getState();
  if(res && !user.uid){
    res.redirect('/login')
  } else if(!user.uid){
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

export default connect(state => state)(Dashbaord);
