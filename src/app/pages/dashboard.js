import React from 'react'
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


const DashbaordBase = ({ user, userCardCollectionObject, setUserCardCollectionObject, cardCollection }) => {

  React.useEffect(() => {
    setUserCardCollectionObject(cardCollection)
  }, []);

  const TheCollectionValue = () => {
    const pricesOfCardsInCollection = userCardCollectionObject.map(card => card.prices.usd || card.prices.usd_foil);
    const rondedToMoneyTotalPriceOfCardsInCollection = moneyRoundOfArray(pricesOfCardsInCollection);
    return (
      <>{rondedToMoneyTotalPriceOfCardsInCollection}</>
    )
  }

  const TheBenchmarkCollectionValue = () => {
    const pricesOfCardsInCollection = userCardCollectionObject.map(card => card.benchMarkPrice);
    const rondedToMoneyTotalPriceOfCardsInCollection = moneyRoundOfArray(pricesOfCardsInCollection);
    return (
      <>{rondedToMoneyTotalPriceOfCardsInCollection}</>
    )
  }

  const handleRemoveCardFromUsersCollection = async (card) => {
    await deleteCardFromUsersCollection(user, card)
    const usersCards = _.filter(userCardCollectionObject, (c) => { return c.id !== card.id; });
    setUserCardCollectionObject(usersCards);
  }

  const renderCard = (card, i ) => {

    const CardInfo = () => {

      const ChangeSinceBenchmark = () => {
        const currentPrice = parseFloat(card.prices.usd || card.prices.usd_foil);
        const benchMarkPrice = parseFloat(card.benchMarkPrice);
        return roundMoney(currentPrice - benchMarkPrice);
      }

      const PercentageChangeSinceBenchmark = () => {
        const currentPrice = parseFloat(card.prices.usd || card.prices.usd_foil);
        const benchMarkPrice = parseFloat(card.benchMarkPrice);
        return Math.floor(((currentPrice - benchMarkPrice) / benchMarkPrice) * 100);
      }

      return (
        <div>
          <div>{card.name}</div>
          <div>Current Price {card.prices.usd || card.prices.usd_foil}</div>
          <div>Benchmark Price {card.benchMarkPrice}</div>
          <div>Banmark Diff <ChangeSinceBenchmark /> | %<PercentageChangeSinceBenchmark /></div>
        </div>
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

  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
      <h1>Dashbaord page</h1>
      <h2>User Info</h2>
      <div>
        <p>Email: {user.email}</p>
      </div>
      <h2>Collection</h2>
      <h3>Collection info</h3>
      <div>Collection: Value: <TheCollectionValue /> | Collecton benchMarkPrice <TheBenchmarkCollectionValue /></div>
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

  let identifiers = [];

  usersCardCollctionIds.forEach((id)=>{
    const dis = {
      id: id
    }
    identifiers.push(dis)
  })

  let usersCardCollection;
  await axios.post('https://api.scryfall.com/cards/collection', {
    identifiers: identifiers
  }).then((res)=>{
    usersCardCollection = res.data.data
  }).catch((err)=>{
    console.log(err)
  })


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
