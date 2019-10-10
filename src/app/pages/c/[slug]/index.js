import React from 'react'
import Layout from '../../../layouts/Layout';
import axios from 'axios';
import Card from '../../../components/Card';
import firebase from 'firebase/app'
import 'firebase/firestore';
import clientCredentials from '../../../../functions/credentials/client';

const Index = ({ card }) => {
  if(!card){
    card = {}
  }
  const setKeys = Object.keys(card)
  const renderSetKeyAndValue = (key, i) => {
    return (
      <tr key={i}>
        <td>{key}</td>
        <td>{card[key].toString()}</td>
      </tr>
    )
  };

  const RenderCardInfo = () => {
    return (
      <table>
        <tbody>
          {setKeys &&
            setKeys.map((key, i) => renderSetKeyAndValue(key, i))
          }
        </tbody>
      </table>
    )
  }

  return (
    <Layout pageMod="card">
      {/* <RenderCardInfo /> */}
      <Card />
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };
  const cardRef = firebase.firestore().collection("cards").where('id', '==', query.slug);
  let card = {};
  await cardRef.get()
    .then((snap) =>{
      card = snap.docs.map(d => d.data())[0];
      reduxStore.dispatch({ type: 'SET_ITEM', name: 'card', payload: card });
    })
    .catch(err => console.log(err))
  return { card }
};

export default Index
