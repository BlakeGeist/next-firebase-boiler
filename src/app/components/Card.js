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

const CardBase = ({
  card,
  dispatch,
  completedAvgFoilPrice, setCompltedAvgFoilPrice,
  avgFoilPriceAfterOutliers, avgAvgFoilPriceAfterOutliers,
  avgFoilPrice, setAvgFoilPrice,
  completedAvgPriceAfterOutliers, setCompletedAvgPriceAfterOutliers,
  completedAvgPrice, setCompletedAvgPrice,
  ebaySearchResuslts, setEbaySearchResuslts,
  ebayActiveSearchResuslts, setEbayActiveSearchResuslts,
  avgPrice, setAvgPrice,
  avgPriceAfterOutliers, setAvgPriceAfterOutliers
 }) => {

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

  function fetchActiveListingsData(page){
    let options =  {
      'OPERATION-NAME': 'findItemsByKeywords',
      'keywords': card.name + ' mtg'
    }
    if(page){
      options['paginationInput.pageNumber'] = page;
    }
    let apiCall = buildEbayApiCall(options)
    runFetchJsonp(apiCall)
  }

  function fetchCompletedListingData(page){
    let options =  {
      'OPERATION-NAME': 'findCompletedItems',
      'keywords': card.name + ' mtg'
    }
    if(page){
      options['paginationInput.pageNumber'] = page;
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

        let results = [];
        let theResults = [];
        let nonFoils = [];
        let foils = [];
        let prices = [];
        let foilPrices = [];

        if(json.findCompletedItemsResponse) {
          results = json.findCompletedItemsResponse[0].searchResult[0].item;
        } else {
          results = json.findItemsByKeywordsResponse[0].searchResult[0].item;
        }


        results.forEach((result) => {
          const resultTitle = result.title[0].toLowerCase();
          const price = parseFloat(result.sellingStatus[0].currentPrice[0].__value__);
          const pricePerItem = roundMoney(price / firstNumber(resultTitle));

          if(resultTitle.includes('foil') || resultTitle.includes('promo')) {
            foils.push(result)
            foilPrices.push(pricePerItem)
          } else {
            nonFoils.push(result)
            prices.push(pricePerItem)
          }
        })



        theResults = theResults.concat(foils)
        theResults = theResults.concat(nonFoils)
        const averageOfArray = roundMoney(getAverage(prices));
        const averageOfFoilArray = roundMoney(getAverage(foilPrices));
        const filteredArray = filterOutliers(prices);
        const averageOfArrayAfterOutliersAreRemoved = getAverage(filteredArray);
        const roundedAverageOfArray = roundMoney(averageOfArrayAfterOutliersAreRemoved);


        let theResultsObj = {
          data: theResults
        }


        if(json.findCompletedItemsResponse) {
          theResultsObj.paginationOutput = json.findCompletedItemsResponse[0].paginationOutput[0]
          setEbaySearchResuslts(theResultsObj)
          setCompletedAvgPrice(averageOfArray)
          setCompletedAvgPriceAfterOutliers(roundedAverageOfArray)
          setCompltedAvgFoilPrice(averageOfFoilArray)
        } else {
          theResultsObj.paginationOutput = json.findItemsByKeywordsResponse[0].paginationOutput[0]
          setEbayActiveSearchResuslts(theResultsObj)
          setAvgPrice(averageOfArray)
          setAvgPriceAfterOutliers(roundedAverageOfArray)
          setAvgFoilPrice(averageOfFoilArray)
        }
        console.log(theResultsObj)
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
  }

  let cleanedSetName = card.set_name.replace(/ /g, '+');
  cleanedSetName = cleanedSetName.replace(/,/g, '');

  let cleanedCardName = card.name.replace(/ /g, '+');
  cleanedCardName = cleanedCardName.replace(/,/g, '');

  const baseGoldFlishLink = "https://www.mtggoldfish.com/price/";


  let goldFishLink = baseGoldFlishLink + cleanedSetName  + '/' + cleanedCardName + '#paper'

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
        <p>
          <a href={"https://shop.tcgplayer.com/magic/product/show?ProductName=" + encodeURI(card.name)} target="_blank">TCG Player</a> |
          <a href={goldFishLink} target="_blank">Goldfish</a>
      </p>
        <p><button onClick={handleFetchEbayInfo}>Ebay Info</button></p>
        <EbaySearchTable
          results={ebayActiveSearchResuslts}
          title="Active"
          avgPrice={avgPrice}
          avgPriceAfterOutliers={avgPriceAfterOutliers}
          avgFoilPrice={avgFoilPrice}
          updateDataByPage={fetchActiveListingsData}
          />
        <EbaySearchTable
          results={ebaySearchResuslts}
          title="Completed"
          avgPrice={completedAvgPrice}
          avgPriceAfterOutliers={completedAvgPriceAfterOutliers}
          avgFoilPrice={completedAvgFoilPrice}
          updateDataByPage={fetchCompletedListingData}
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
        .highlight{
          border: 1px solid green;
        }
      `}</style>
    </div>
  )
};

const Card = compose(
  withState('ebaySearchResuslts', 'setEbaySearchResuslts', { data: []}),
  withState('ebayActiveSearchResuslts', 'setEbayActiveSearchResuslts', { data: []}),
  withState('avgPrice', 'setAvgPrice', ''),
  withState('avgPriceAfterOutliers', 'setAvgPriceAfterOutliers', ''),
  withState('avgFoilPrice', 'setAvgFoilPrice', ''),
  withState('avgFoilPriceAfterOutliers', 'avgAvgFoilPriceAfterOutliers', ''),
  withState('completedAvgPrice', 'setCompletedAvgPrice', ''),
  withState('completedAvgPriceAfterOutliers', 'setCompletedAvgPriceAfterOutliers', ''),
  withState('completedAvgFoilPrice', 'setCompltedAvgFoilPrice', ''),
  withState('ebayResponseObj', 'setebayResponseObj', {})
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
