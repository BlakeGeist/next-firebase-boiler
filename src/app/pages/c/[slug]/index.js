import React from 'react'
import Layout from '../../../layouts/Layout';
import axios from 'axios';
import Card from '../../../components/Card';

const Index = ({ card }) => {
  return (
    <Layout pageMod="card">
      <Card />
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  let card = await axios.get('https://api.scryfall.com/cards/' + query.slug);
  reduxStore.dispatch({ type: 'SET_ITEM', name: 'card', payload: card.data });
};

export default Index
