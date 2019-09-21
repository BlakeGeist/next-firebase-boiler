import React from 'react'
import Layout from '../../../layouts/Layout';
import { useRouter } from 'next/router'
import axios from 'axios';
import Card from '../../../components/Card';

const ScryfallClient = require('scryfall-client')
const scryfall = new ScryfallClient()

const Index = ({ card }) => {
  console.log(card)
  return (
    <Layout pageMod="card">
      <Card card={card} />
    </Layout>
  )
}

Index.getInitialProps = async function(context) {
  const { slug } = context.query;
  let response = await axios.get('https://api.scryfall.com/cards/multiverse/'+slug);
  const card = response.data;
  return { card }
};

export default Index
