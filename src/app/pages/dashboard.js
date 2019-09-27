import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../functions/credentials/client'
import Router from 'next/router';
import Link from 'next/link'
import  _ from 'lodash';
import { compose, withState } from 'recompose';
const { moneyRoundOfArray, roundMoney } = require("../helpers/quickHelpers");
const { deleteCardFromUsersCollection } = require("../helpers/cardCollectionHelpers");

const DashbaordBase = ({ user, userCardCollectionObject, setUserCardCollectionObject, usersCardCollection, collectionValue, setCollectionValue }) => {

  React.useEffect(() => {
    setUserCardCollectionObject(usersCardCollection)
    updateCollectionValue(usersCardCollection)
  }, []);

  const updateCollectionValue = (collection) => {
    let collectionValueArray = [];
    collection.forEach(card => {
      const price = card.prices.usd || card.prices.usd_foil
      collectionValueArray.push(price)
    })
    const collectionValue = moneyRoundOfArray(collectionValueArray)
    setCollectionValue(collectionValue)
  }

  const handleRemoveCardFromUsersCollection = async (card) => {
    await deleteCardFromUsersCollection(user, card)
    const usersCards = _.filter(userCardCollectionObject, (c) => { return c.id !== card.id; });
    setUserCardCollectionObject(usersCards);
    updateCollectionValue(usersCards)
  }

  const renderCard = (card, i ) => {
    return (
      <div className="cards-card" key={i}>
        <div>
          <button onClick={e => handleRemoveCardFromUsersCollection(card)}>Delete</button>

          <div>{card.name}</div>
          {card.prices.usd ? (
            <div>${card.prices.usd}</div>
          ) : (
            <div>${card.prices.usd_foil}</div>
          )}
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

  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
      <h1>Dashbaord page</h1>
      <h2>User Info</h2>
      <div>
        <p>Email: {user.email}</p>
      </div>
      <h2>Collection</h2>
      <h3>Collection info</h3>
      <div>Collection: Value: {collectionValue}</div>
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

const Dashbaord = compose(
  withState('userCardCollectionObject', 'setUserCardCollectionObject', []),
  withState('collectionValue', 'setCollectionValue', '')
)(DashbaordBase);

Dashbaord.getInitialProps = async ({reduxStore, req, query, res}) => {
  const { user } = reduxStore.getState();
  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };
  const isServer = !!req

  const cardCollections = firebase.firestore().collection("userCardCollections")
  const usersCardCollections = cardCollections.doc(user.uid)
  let usersCardCollection
  await usersCardCollections.collection('cards').get()
    .then((snap) =>{
      usersCardCollection = snap.docs.map(d => d.data());
    })
    .catch((err) => {
      console.log(err)
    })

  return { usersCardCollection };
}

export default connect(state => state)(Dashbaord);
