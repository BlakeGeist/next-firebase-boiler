import React, { useState } from 'react';
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../functions/credentials/client'
import Router from 'next/router';
import Link from 'next/link'
import  _ from 'lodash';
import axios from 'axios';
import { compose, withState } from 'recompose';
const { moneyRoundOfArray, roundMoney } = require("../helpers/quickHelpers");
const { deleteCardFromUsersCollection } = require("../helpers/cardCollectionHelpers");


const Dashbaord = ({ user, userCardCollectionObject, setUserCardCollectionObject, cardCollection }) => {

  [userCardCollectionObject, setUserCardCollectionObject] = useState(cardCollection)

  const pricesOfCardsInCollection = userCardCollectionObject.map(card => (card.prices.usd || card.prices.usd_foil) * card.qty);
  const rondedToMoneyTotalPriceOfCardsInCollection = moneyRoundOfArray(pricesOfCardsInCollection);
  const benchmarkPricesOfCardsInCollection = userCardCollectionObject.map(card => card.benchMarkPrice * card.qty);
  const rondedToMoneyTotalPriceOfCardMarkssInCollection = moneyRoundOfArray(benchmarkPricesOfCardsInCollection);
  const changeOfPricesOfCardsInCollectionVsBenchmarkPricesOfCardsInCollection = roundMoney(rondedToMoneyTotalPriceOfCardsInCollection - rondedToMoneyTotalPriceOfCardMarkssInCollection)
  const precentageChangeOfPricesOfCardsInCollectionVsBenchmarkPricesOfCardsInCollection =  Math.floor(((rondedToMoneyTotalPriceOfCardsInCollection - rondedToMoneyTotalPriceOfCardMarkssInCollection) / rondedToMoneyTotalPriceOfCardMarkssInCollection) * 100);

  const handleRemoveCardFromUsersCollection = async (card) => {
    await deleteCardFromUsersCollection(user, card)
    const usersCards = _.filter(userCardCollectionObject, (c) => { return c.id !== card.id; });
    setUserCardCollectionObject(usersCards);
  }

  const renderCard = (card, i ) => {

    const CardInfo = () => {
      const currentPrice = parseFloat(card.prices.usd || card.prices.usd_foil);
      const benchMarkPrice = card.benchMarkPrice / 100;
      const changeSinceBenchmark = roundMoney(currentPrice - benchMarkPrice);
      const percentageChangeSinceBenchmark = Math.floor(((currentPrice - benchMarkPrice) / benchMarkPrice) * 100);

      return (
        <div>
          <div>{card.name}</div>
          <div>{card.qty}</div>
          <div>Current Price ${card.prices.usd || card.prices.usd_foil}</div>
          <div>Benchmark Price ${card.benchMarkPrice / 100}</div>
          <div>Banmark Diff ${changeSinceBenchmark} | %{percentageChangeSinceBenchmark}</div>
        </div>
      )
    }

    const CardCall = (card) => {
      const cardFace = card.card.card_faces[0];
      return (
        <Link href="/c/[id]" as={`/c/${card.card.id}`}>
          <a>
            <div><img src={cardFace.image_uris.normal} width="260px" height="362px;" /></div>
          </a>
        </Link>
      )
    }

    return (
      <div className="cards-card" key={i}>
        <div>
          <button onClick={e => handleRemoveCardFromUsersCollection(card)}>Delete</button>
          <CardInfo />
          {card.image_uris ?
            (
              <Link href="/c/[id]" as={`/c/${card.id}`}>
                <a>
                  <div><img src={card.image_uris.normal} width="260px" height="362px;" /></div>
                </a>
              </Link>
            ) : (
              <div>
                <CardCall card={card} />
              </div>
            )
          }
        </div>
      </div>
    )
  }

  const handleEbayLogin = (e) => {
    e.preventDefault()
    window.location ='https://auth.ebay.com/oauth2/authorize?client_id=BlakeGei-standard-PRD-ee6e394ea-800e1243&response_type=code&redirect_uri=Blake_Geist-BlakeGei-standa-oysusnr&scope=https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances'
  }

  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
      <h1>Dashbaord page</h1>
      <h2>User Info</h2>
      <div>
        <p>Email: {user.email} | <a onClick={handleEbayLogin} href="">Link Ebay</a></p>
      </div>
      <h2>Collection info</h2>

      <table>
        <tbody>
          <tr>
            <td>Total Unique Cards In Collection</td>
            <td>{userCardCollectionObject.length}</td>
          </tr>
          <tr>
            <td>Collection Value</td>
            <td>${rondedToMoneyTotalPriceOfCardsInCollection}</td>
          </tr>
          <tr>
            <td>Collection Benchmark Price</td>
            <td>${rondedToMoneyTotalPriceOfCardMarkssInCollection / 100}</td>
          </tr>
          <tr>
            <td>Collection Value Change</td>
            <td>${changeOfPricesOfCardsInCollectionVsBenchmarkPricesOfCardsInCollection / 100}</td>
          </tr>
          <tr>
            <td>Collection Precentage Change</td>
            <td>%{precentageChangeOfPricesOfCardsInCollectionVsBenchmarkPricesOfCardsInCollection}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <div className="cards">
        {userCardCollectionObject.map((card, i) => renderCard(card, i))}
      </div>

      <style global jsx>{`
        .cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </Layout>
  )
}

Dashbaord.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const { user } = reduxStore.getState();
  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };
  const isServer = !!req

  const cardCollections = firebase.firestore().collection("userCardCollections")
  const usersCardCollectionData = cardCollections.doc(user.uid)
  let usersCardCollectionDataIds;
  await usersCardCollectionData.collection('cards').get()
    .then((snap) =>{
      usersCardCollectionDataIds = snap.docs.map(d => d.data());
    })
    .catch((err) => {
      console.log(err)
    })

  const usersCardCollctionIds = usersCardCollectionDataIds.map(d => d.id);

  let usersCardCollection = [];

  let proms = [];

  const cardCollectionFirebase = firebase.firestore().collection('cards');
  usersCardCollctionIds.forEach(cardId => {
    proms.push(
    cardCollectionFirebase.doc(cardId).get()
      .then(doc => {
        usersCardCollection.push(doc.data())
      })
      .catch(err => console.log(err))
    )
  })

  await Promise.all(proms)

  let cardCollection = [];

  if(usersCardCollection){
    for(let i=0; i<usersCardCollection.length; i++) {
      cardCollection.push({
       ...usersCardCollection[i],
       ...(usersCardCollectionDataIds.find((itmInner) => itmInner.id === usersCardCollection[i].id))}
      );
    }
  }

  return { cardCollection };
}

export default connect(state => state)(Dashbaord);
