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
import Modal from '../components/Modal';
import Head from 'next/head'

const { moneyRoundOfArray, roundMoney } = require("../helpers/quickHelpers");
const { deleteCardFromUsersCollection } = require("../helpers/cardCollectionHelpers");

const qs = require('qs');

const Dashbaord = ({ user, userCardCollectionObject, setUserCardCollectionObject, cardCollection, modalIsOpen, dispatch }) => {

  [userCardCollectionObject, setUserCardCollectionObject] = useState(cardCollection)

  const pricesOfCardsInCollection = userCardCollectionObject.map(card => (card.prices.usd || card.prices.usd_foil) * card.qty / 100);
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
      const currentPrice = parseFloat(card.prices.usd || card.prices.usd_foil) / 100;
      const benchMarkPrice = card.benchMarkPrice / 100;
      const changeSinceBenchmark = roundMoney(currentPrice - benchMarkPrice);
      const percentageChangeSinceBenchmark = Math.floor(((currentPrice - benchMarkPrice) / benchMarkPrice) * 100);

      const initSellCardFlow = (e) => {
        e.preventDefault();

        dispatch({ type: 'SET_ITEM', name: 'modalIsOpen', payload: true });
        dispatch({ type: 'SET_ITEM', name: 'modalCard', payload: card });

        return

        axios({
        		method: 'POST',
        		url: '/api/sellCard',
            params: qs.stringify({
              'RequesterCredentials' : {
                'eBayAuthToken': user.ebayData.access_token
              },
              'Item': {
                'Title': 'Harry Potter'
              }
            })
        	})
          .then((data) => {
            console.log('this was sucess')
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })

      }

      return (
        <div>
          <div>{card.name}</div>
          <div>QTY: {card.qty}</div>
          <div>Current Price ${currentPrice}</div>
          <div>Benchmark Price ${benchMarkPrice}</div>
          <div>Banmark Diff ${changeSinceBenchmark} | %{percentageChangeSinceBenchmark}</div>
          <div><a href="" onClick={initSellCardFlow}>Sell</a></div>
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

  const ModalContainer = () => {
    if(modalIsOpen){
      return <Modal />
    }
    return ''
  }

  const EbayData = () => {
    return (
      <a onClick={handleEbayLogin} href="">Link Ebay</a>
    )
  }

  const handleEbayLogin = (e) => {
    e.preventDefault()

    axios({
        method: 'POST',
        url: '/api/linkEbayAccount'
      })
      .then((data) => {
        window.location = 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&runame=Blake_Geist-BlakeGei-standa-xrzudr&SessID=' + data.data
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
      <Head>
       <script src='https://cdn.tiny.cloud/1/hrdu9ovp596k3gsafc7irg2b83dl98x3e1020egi97hkxeiu/tinymce/5/tinymce.min.js'></script>
      </Head>
      <h1>Dashbaord page</h1>
      <h2>User Info</h2>
      <div>
        Email: {user.email} | <EbayData />
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
      <ModalContainer />
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

  cardCollection = _.orderBy(cardCollection, ['prices.usd', 'prices.usd_foil'], 'desc')


  return { cardCollection };
}

export default connect(state => state)(Dashbaord);
