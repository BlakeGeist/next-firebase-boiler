import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import Router from 'next/router';
import axios from 'axios';

import EbayCardSearchContainer from './EbayCardSearch/EbayCardSearchContainer';

const { filterOutliers,  getAverage, roundMoney, firstNumber, priceByQTY } = require("../helpers/quickHelpers");

const Card = ({ card, randoCard }) => {

  const hanldeFetchNewRandomCard = async (e) => {
    e.preventDefault();
    let card = await axios.get('https://api.scryfall.com/cards/random');
    Router.push(('/c/' + card.data.id))
  }

  const MTGGoldFishLink = () => {
    let cleanedSetName = card.set_name.replace(/ /g, '+');
    let cleanedCardName = card.name.replace(/ /g, '+');
    cleanedSetName = cleanedSetName.replace(/,/g, '');
    cleanedCardName = cleanedCardName.replace(/,/g, '');
    const baseGoldFlishLink = "https://www.mtggoldfish.com/price/";
    let goldFishLink = baseGoldFlishLink + cleanedSetName  + '/' + cleanedCardName + '#paper'
    return (
      <a href={goldFishLink} target="_blank">Goldfish</a>
    )
  }

  const TCGPlayerLink = () => {
    const tcgPlayerLink = "https://shop.tcgplayer.com/magic/product/show?ProductName=" + encodeURI(card.name)
    return (
      <a href={tcgPlayerLink} target="_blank">TCG Player</a>
    )
  }

  return (
    <div className="card-container">
      <div className="card">
        <h2><a onClick={hanldeFetchNewRandomCard} href="" >Random MTG Card</a></h2>
        {card.name}
        <div>
          <Link href="/c/[id]" as={`/c/${card.id}`}>
            <a><img src={card.image_uris.normal} width="260px" height="362px;" /></a>
          </Link>
        </div>
        <p>Price: ${card.prices.usd} | Foil Price: ${card.prices.usd_foil}</p>
        <p>
          Set: <Link href="/s/[setId]" as={`/s/${card.set}`}><a>{card.set_name}</a></Link>
        </p>
        <p><TCGPlayerLink /> | <MTGGoldFishLink /></p>
        <EbayCardSearchContainer
          operationName="findItemsByKeywords"
          title="Active"
          />
        <hr style={{ margin: "50px 0"}}/>
        <EbayCardSearchContainer
          operationName="findCompletedItems"
          title="Completed"
          />
      </div>
      <style global jsx>{`
        .card-container {
          display: flex;
          justify-content: center;
          padding: 0 15px;
        }
        .card{
          text-align: center;
        }
        .mod-foil{
          background-color: #ccc;
        }
        table{
          text-align: left;
        }
        .mod-sells-today {
          background-color: gold;
        }
        .highlight{
          border: 1px solid green;
        }
      `}</style>
    </div>
  )
};

export default connect(state => state)(Card);

//https://svcs.ebay.com/services/search/FindingService/v1?
   //OPERATION-NAME=findItemsByKeywords&
   //SERVICE-VERSION=1.0.0&
   //SECURITY-APPNAME=YourAppID&
   //RESPONSE-DATA-FORMAT=XML&
   //REST-PAYLOAD&
   //buyerPostalCode=95060&
   //sortOrder=Distance&
   //outputSelector=SellerInfo&
   //itemFilter(0).name=MaxPrice&
   //itemFilter(0).value=2500.00&
   //itemFilter(0).paramName=Currency&
   //itemFilter(0).paramValue=USD&
   //itemFilter(1).name=MinPrice&
   //itemFilter(1).value=2000.00&
   //itemFilter(1).paramName=Currency&
   //itemFilter(1).paramValue=USD&
   //keywords=%22pre-CBS%22
