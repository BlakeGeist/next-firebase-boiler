import React from 'react'
import Layout from '../../../layouts/Layout';
import axios from 'axios';
import Card from '../../../components/Card';

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

  return (
    <Layout pageMod="card">
      <table>
        <tbody>
          {setKeys &&
            setKeys.map((key, i) => renderSetKeyAndValue(key, i))
          }
        </tbody>
      </table>
      <Card />
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  let card = await axios.get('https://api.scryfall.com/cards/' + query.slug);
  reduxStore.dispatch({ type: 'SET_ITEM', name: 'card', payload: card.data });
};

export default Index
