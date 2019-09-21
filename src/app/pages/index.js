import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import Card from '../components/Card';

const ScryfallClient = require('scryfall-client')
const scryfall = new ScryfallClient()

const Index = ({ card }) => {
  return (
    <Layout>
      <h1>Index page</h1>
      <p>Index page content</p>
      {card &&
        <Card card={card} />
      }
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  await scryfall.get('cards/random').then(function (card) {
    reduxStore.dispatch({ type: 'SET_ITEM', name: 'card', payload: card });
  })
}

export default connect(state => state)(Index);
