import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import axios from 'axios';
import firebase from 'firebase/app'
import 'firebase/firestore'
import Link from 'next/link'

const Index = ({ cards }) => {
  const renderCard = (card, i) => {
    return (
      <tr>
        <td>{i+1}</td>
        <td>
          <Link href={`/c/${card.id}`}><a className="navItem">{card.name}</a></Link>
        </td>
        <td>{card.ebaySalesCount}</td>
        <td>{card.prices.usd / 100}</td>
      </tr>
    )
  }
  return (
    <Layout pageMod='index'>
      <div>Cards: {cards.length}</div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Ebay Sales Count</th>
            <th>Price</th>
          </tr>
          {cards &&
            cards.map((card, i) => renderCard(card, i))
          }
        </tbody>
      </table>
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const _ = require('lodash')

  let cards = []

  await firebase.firestore().collection("cardsWithEbaySales").orderBy("ebaySalesCount", "desc").get().then(function(snap) {
    cards = snap.docs.map(d => d.data());
  });

  cards = _.uniqBy(cards, 'name');

  return {cards}

}

export default connect(state => state)(Index);
