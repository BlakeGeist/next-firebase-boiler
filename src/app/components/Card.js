import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import { compose, withState } from 'recompose';
import Router from 'next/router';
import EbaySearchTable from './EbaySearchTable';

const CardBase = ({ card, completedAvgPriceAfterOutliers, setCompletedAvgPriceAfterOutliers, completedAvgPrice, setCompletedAvgPrice, ebaySearchResuslts, setEbaySearchResuslts, dispatch, ebayActiveSearchResuslts, setEbayActiveSearchResuslts, avgPrice, avgPriceAfterOutliers, setAvgPrice, setAvgPriceAfterOutliers }) => {


  const handleFetchEbayInfo = () => {
    const appName = 'BlakeGei-standard-PRD-ee6e394ea-800e1243';
    const anmountToFetch = 1000;


    fetchJsonp('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=' + appName + '&OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=' + card.name + '&sortOrder=PricePlusShippingLowest&categoryId=38292&paginationInput.entriesPerPage=' + anmountToFetch + '&GLOBAL-ID=EBAY-US&siteid=0')
      .then(function(response) {
        return response.json()
      }).then(async (json) => {
        const results = json.findItemsByKeywordsResponse[0].searchResult[0].item;

        setEbayActiveSearchResuslts(results)

        let prices = [];
        results.forEach((result) => {
          const price = parseFloat(result.sellingStatus[0].currentPrice[0].__value__);
          prices.push(price)
        })

        const averageOfArray = roundMoney(getAverage(prices));
        const filteredArray = filterOutliers(prices);
        const averageOfArrayAfterOutliersAreRemoved = getAverage(filteredArray);
        const roundedAverageOfArray = roundMoney(averageOfArrayAfterOutliersAreRemoved);


        setAvgPriceAfterOutliers(roundedAverageOfArray)
        setAvgPrice(averageOfArray)

      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })

    fetchJsonp('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=' + appName + '&OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=' + card.name + '&categoryId=38292&paginationInput.entriesPerPage=' + anmountToFetch + '&GLOBAL-ID=EBAY-US&siteid=0')
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        const results = json.findCompletedItemsResponse[0].searchResult[0].item;

        setEbaySearchResuslts(results)

        let prices = [];
        results.forEach((result) => {
          const price = parseFloat(result.sellingStatus[0].currentPrice[0].__value__);
          prices.push(price)
        })
        const averageOfArray = roundMoney(getAverage(prices));
        const filteredArray = filterOutliers(prices);
        const averageOfArrayAfterOutliersAreRemoved = getAverage(filteredArray);
        const roundedAverageOfArray = roundMoney(averageOfArray);

        setCompletedAvgPrice(roundedAverageOfArray)
        setCompletedAvgPriceAfterOutliers(averageOfArray)

      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })

  }

  const hanldeFetchNewRandomCard = async (e) => {
    const ScryfallClient = require('scryfall-client')
    const scryfall = new ScryfallClient()
    e.preventDefault();
    await scryfall.get('cards/random').then(function (card) {
      Router.push(('/c/' + card.id))
    })
  }

  function filterOutliers(someArray) {
    if(someArray.length < 4)
      return someArray;
    let values, q1, q3, iqr, maxValue, minValue;
    values = someArray.slice().sort( (a, b) => a - b);//copy array fast and sort
    if((values.length / 4) % 1 === 0){//find quartiles
      q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
      q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
    } else {
      q1 = values[Math.floor(values.length / 4 + 1)];
      q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
    }
    iqr = q3 - q1;
    maxValue = q3 + iqr * 1.5;
    minValue = q1 - iqr * 1.5;
    return values.filter((x) => (x >= minValue) && (x <= maxValue));
  }

  function getAverage(someArray){
    let total = 0;
    someArray.forEach((int) => {
      total += int;
    });
    let average = total / someArray.length;
    return average;
  }

  function roundMoney(float){
    return Math.ceil(float * 100) / 100;
  }

  function firstNumber(string){
    if(string.match(/\d+/)){
      if (string.match(/\d+/)[0] > 4) {
        return 1
      } else {
        return string.match(/\d+/)[0]
      }
    } else {
      return 1
    }
  }

  function priceByQTY(number, price){
    return '$' + roundMoney(price / number);
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
          />
        <EbaySearchTable
          results={ebaySearchResuslts}
          title="Completed"
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
