import React from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import { compose, withState } from 'recompose';
import Router from 'next/router';

const CardBase = ({ card, ebaySearchResuslts, setEbaySearchResuslts, dispatch }) => {

  const handleFetchEbayInfo = () => {
    const appName = 'BlakeGei-standard-PRD-ee6e394ea-800e1243';
    const anmountToFetch = 100;
    fetchJsonp('https://svcs.ebay.com/services/search/FindingService/v1?SECURITY-APPNAME=' + appName + '&OPERATION-NAME=findCompletedItems&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=' + card.name + '&categoryId=38292&paginationInput.entriesPerPage=' + anmountToFetch + '&GLOBAL-ID=EBAY-US&siteid=0')
      .then(function(response) {
        return response.json()
      }).then(function(json) {

        const results = json.findCompletedItemsResponse[0].searchResult[0].item;
        setEbaySearchResuslts(results)

        let prices = [];
        results.forEach((result) => {
          console.log(result)
          const price = parseFloat(result.sellingStatus[0].currentPrice[0].__value__);
          prices.push(price)
        })
        const filteredArray = filterOutliers(prices);
        const averageOfArray = getAverage(filteredArray);
        const roundedAverageOfArray = roundMoney(averageOfArray);

        console.log(filteredArray)
        console.log(averageOfArray);
        console.log(roundedAverageOfArray);

      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
  }

  const renderEbaySearchResult = (result, i) => {
    const date = result.listingInfo[0].endTime;
    let myDate;
    if(date){
      myDate = new Date(date);
    }
    return (
      <tr key={i}>
        <td><a href={result.viewItemURL[0]}>Link</a></td>
        <td>${result.sellingStatus[0].currentPrice[0].__value__}</td>
        <td>{myDate.toDateString()}</td>
      </tr>
    )
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
        <p>Prices: ${card.prices.usd}</p>
        <p>
          Set: <Link href="/s/[setId]" as={`/s/${card.set}`}><a>{card.set_name}</a></Link>
        </p>
        <p><button onClick={handleFetchEbayInfo}>Ebay Info</button></p>
        {ebaySearchResuslts &&
          <div>
            <table>
              <tbody>
                <tr>
                  <th>Ebay Link</th>
                  <th>Sell Price</th>
                  <th>Sell Date</th>
                </tr>
                {ebaySearchResuslts.map((result, i) => renderEbaySearchResult(result, i))}
              </tbody>
            </table>
          </div>
        }
      </div>
      <style global jsx>{`
        .card-container {
          display: flex;
          justify-content: center;
        }
        .card{
          text-align: center;
        }
      `}</style>
    </div>
  )
};

const Card = compose(
  withState('ebaySearchResuslts', 'setEbaySearchResuslts', [])
)(CardBase);

export default connect(state => state)(Card);
