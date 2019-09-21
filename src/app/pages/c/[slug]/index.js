import React from 'react'
import Layout from '../../../layouts/Layout';
import { useRouter } from 'next/router'
import axios from 'axios';
import Card from '../../../components/Card';

const ScryfallClient = require('scryfall-client')
const scryfall = new ScryfallClient()

const Index = ({ card }) => {
  return (
    <Layout pageMod="card">
      <Card  />
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const { slug } = query;
  let response = await axios.get('https://api.scryfall.com/cards/'+slug);
  const card = response.data;
  reduxStore.dispatch({ type: 'SET_ITEM', name: 'card', payload: card });
  return {  }
};

export default Index
