import React from 'react'
import Layout from '../../../layouts/Layout';
import axios from 'axios';
import Link from 'next/link'

const Index = ({ set, cards }) => {

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
    return (
      <div className="cards-card" key={i}>
        <div>
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

  let cards = [];
  let page = 1;

  response = await axios.get(apiCall);

  cards = cards.concat(response.data.data)

  while(response.data.has_more) {
    page++;
    response = await axios.get(apiCall + '&page='+page);
    cards = cards.concat(response.data.data);
  }

  return { set, cards }
};

export default Index
