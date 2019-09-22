import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import { compose, withState } from 'recompose';
import Router from 'next/router';
import EbaySearchTable from './EbaySearchTable';
import buildEbayApiCall from '../helpers/buildEbayApiCall';
const { filterOutliers,  getAverage, roundMoney, firstNumber, priceByQTY } = require("../helpers/quickHelpers");

console.log(filterOutliers)

const CardBase = ({ card, completedAvgPriceAfterOutliers, setCompletedAvgPriceAfterOutliers, completedAvgPrice, setCompletedAvgPrice, ebaySearchResuslts, setEbaySearchResuslts, dispatch, ebayActiveSearchResuslts, setEbayActiveSearchResuslts, avgPrice, avgPriceAfterOutliers, setAvgPrice, setAvgPriceAfterOutliers }) => {

  const handleFetchEbayInfo = () => {
    fetchActiveListingsData();
    fetchCompletedListingData();
  }

  const hanldeFetchNewRandomCard = async (e) => {
    const ScryfallClient = require('scryfall-client')
    const scryfall = new ScryfallClient()
    e.preventDefault();
    await scryfall.get('cards/random').then(function (card) {
      Router.push(('/c/' + card.id))
    })
  }

  function fetchActiveListingsData(){
    const options =  {
      'OPERATION-NAME': 'findItemsByKeywords',
      'keywords': card.name
    }
    let apiCall = buildEbayApiCall(options)
    runFetchJsonp(apiCall)
  }

  function fetchCompletedListingData(){
    const options =  {
      'OPERATION-NAME': 'findCompletedItems',
      'keywords': card.name
    }
    let apiCall = buildEbayApiCall(options)
    runFetchJsonp(apiCall)
  }

  function runFetchJsonp(apiCall){
    fetchJsonp(apiCall)
      .then(function(response) {
        return response.json()
      }).then((json) => {
        console.log(json)
        let results = []
        if(json.findCompletedItemsResponse) {
          results = json.findCompletedItemsResponse[0].searchResult[0].item;
        } else {
          results = json.findItemsByKeywordsResponse[0].searchResult[0].item;
        }

        let prices = [];
        results.forEach((result) => {
          const price = parseFloat(result.sellingStatus[0].currentPrice[0].__value__);
          prices.push(price)
        })

        const averageOfArray = roundMoney(getAverage(prices));
        const filteredArray = filterOutliers(prices);
        const averageOfArrayAfterOutliersAreRemoved = getAverage(filteredArray);
        const roundedAverageOfArray = roundMoney(averageOfArrayAfterOutliersAreRemoved);

        if(json.findCompletedItemsResponse) {
          setEbaySearchResuslts(results)
          setAvgPriceAfterOutliers(roundedAverageOfArray)
          setAvgPrice(averageOfArray)
        } else {
          setEbayActiveSearchResuslts(results)
          setAvgPriceAfterOutliers(roundedAverageOfArray)
          setAvgPrice(averageOfArray)
        }
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
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
        <p><button onClick={handleFetchEbayInfo}>Ebay Info</button></p>
        <EbaySearchTable
          results={ebayActiveSearchResuslts}
          title="Active"
          avgPrice={avgPrice}
          avgPriceAfterOutliers={avgPriceAfterOutliers}
          />
        <EbaySearchTable
          results={ebaySearchResuslts}
          title="Completed"
          avgPrice={completedAvgPrice}
          avgPriceAfterOutliers={completedAvgPriceAfterOutliers}
          />
      </div>
      <style global jsx>{`
        .card-container {
          display: flex;
          justify-content: center;
        }
        .card{
          text-align: center;
        }
        .mod-foil{
          background-color: #f1f1f1;
        }
        table{
          text-align: left;
        }
        .mod-sells-today {
          background-color: gold;
        }
      `}</style>
    </div>
  )
};

const Card = compose(
  withState('ebaySearchResuslts', 'setEbaySearchResuslts', []),
  withState('ebayActiveSearchResuslts', 'setEbayActiveSearchResuslts', []),
  withState('avgPrice', 'setAvgPrice', ''),
  withState('avgPriceAfterOutliers', 'setAvgPriceAfterOutliers', ''),
  withState('completedAvgPrice', 'setCompletedAvgPrice', ''),
  withState('completedAvgPriceAfterOutliers', 'setCompletedAvgPriceAfterOutliers', '')
)(CardBase);

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
