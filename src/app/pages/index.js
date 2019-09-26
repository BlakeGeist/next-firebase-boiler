import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import Card from '../components/Card';
import axios from 'axios';

const Index = ({ card }) => {
  return (
    <Layout pageMod='index'>
      {card &&
        <Card />
      }
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  let card = await axios.get('https://api.scryfall.com/cards/random');
  reduxStore.dispatch({ type: 'SET_ITEM', name: 'card', payload: card.data });
}

export default connect(state => state)(Index);
