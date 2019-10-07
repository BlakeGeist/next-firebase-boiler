import React from 'react'
import Layout from '../../../layouts/Layout';
import axios from 'axios';
import Link from 'next/link'
import { connect } from 'react-redux'
import clientCredentials from '../../../../functions/credentials/client'
const { addCardToUsersCollection } = require("../../../helpers/cardCollectionHelpers");
import { compose, withState } from 'recompose';
import firebase from 'firebase/app'
import 'firebase/firestore'
import _ from 'lodash';
import SetCard from '../../../components/SetCard';

const Index = ({ user, set, cards }) => {
  const setKeys = Object.keys(set)
  const renderSetKeyAndValue = (key, i) => {
    return (
      <tr key={i}>
        <td>{key}</td>
        <td>{set[key].toString()}</td>
      </tr>
    )
  };

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

  const renderCard = (card, i ) => {
    const handleAddCardToUsersCollection = (e) => {
      e.preventDefault();
      const benchMarkPrice = card.prices.usd || card.prices.usd_foil;
      axios({
        url: '/api/usersCardCollection/add',
        params: {
          id: card.id,
          qty: e.target.amount.value,
          benchMarkPrice: benchMarkPrice
        }
      }).then((res)=> {
        console.log(res)
      }).catch((err)=>{
        console.log(err)
      })
    }
    return (
      <div className="cards-card" key={i}>
        <div>
          <SetCard card={card}/>
          <div>{card.name}</div>
          {card.prices.usd ? (
            <div>${card.prices.usd / 100}</div>
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
    <Layout pageMod="set">
      <div>
        <div>
          <h2>{set.name}</h2>
          <table>
            <tbody>
              {setKeys &&
                setKeys.map((key, i) => renderSetKeyAndValue(key, i))
              }
            </tbody>
          </table>
        </div>
        <div className="cards">
          {cards &&
            cards.map((card, i) => renderCard(card, i))
          }
        </div>
      </div>
      <style global jsx>{`
          .cards{
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            margin-top: 25px;
          }
            .cards-card{
              padding: 15px 0;
            }
        `}</style>
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const { setId } = query;
  let response = await axios.get('https://api.scryfall.com/sets/'+setId);
  const set = response.data;
  const apiCall = 'https://api.scryfall.com/cards/search?order=usd&q=s:'+set.code;
  let page = 1;
  response = await axios.get(apiCall);

  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };
  const cardCollections = firebase.firestore().collection("cards").where('set', '==', setId)

  let cards;

  await cardCollections.get()
    .then((snap) =>{
      cards = snap.docs.map(d => d.data());
    })
    .catch((err) => {
      console.log(err)
    })

  cards = _.orderBy(cards, ['prices.usd', 'prices.usd_foil'], 'desc')

  return { set, cards }
};

export default connect(state => state)(Index);
