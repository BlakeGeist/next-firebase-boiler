import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import axios from 'axios';

import EbayCardSearchInputs from './EbayCardSearchInputs';
import EbaySearchTable from './EbaySearchTable'

const { filterOutliers,  getAverage, roundMoney, firstNumber, priceByQTY } = require("../../helpers/quickHelpers");

const EbayCardSearchContainerBase = ({ title, card, operationName, state, setState }) => {

  function cleanEbayData(data){
    let results = [];
    let theResults = [];
    let nonFoils = [];
    let foils = [];
    let prices = [];
    let foilPrices = [];
    results = data.searchResult[0].item;
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
    let theResultsObj = {
      data: theResults,
      avgPrice: roundMoney(getAverage(prices)),
      avgFoilPrice: roundMoney(getAverage(foilPrices))
    }

    theResultsObj.paginationOutput = data.paginationOutput[0]
    return theResultsObj;
  }

  function fetchEbayData(page, e){
    let params = {
      'SECURITY-APPNAME': 'BlakeGei-standard-PRD-ee6e394ea-800e1243',
      'OPERATION-NAME': operationName,
      'SERVICE-VERSION': '1.0.0',
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': '',
      'paginationInput.entriesPerPage': state.qty,
      'GLOBAL-ID': 'EBAY-US',
      'siteid': '0',
      'keywords': card.name,
      'sortOrder': state.sortOrder,
      'categoryId': '38292',
      'paginationInput.pageNumber': page,
    }

    if(state.filter){
      params['itemFilter.name'] = 'ListingType'
      params['itemFilter.value'] = state.filter
    }

    axios({
      method: 'GET',
      url: '/api/getEbaySearchData',
      params: params
    }).then(function(response) {
      return response.data
    }).then((json)=>{
      const theResultsObj = cleanEbayData(json);
      updateState('ebaySearchResults', theResultsObj);
    }).catch((err)=>{
      console.log(err)
    })
  }

  function updateState(item, payload) {
    let tempObj = {
      ...state
    }
    tempObj[item] = payload;
    setState(tempObj)
  }

  const updateSortOrder = (e) => {
    updateState('sortOrder', e.target.value)
  }

  const updateFilter = (e) => {
    console.log(e.target.value)
    updateState('filter',  e.target.value)
  }

  const updateQTY = (e) => {
    updateState('qty',  e.target.value)
  }

  return (
    <div className="ebay-seach">
      <EbayCardSearchInputs
        fetchEbayData={fetchEbayData}
        updateSortOrder={updateSortOrder}
        updateFilter={updateFilter}
        updateQTY={updateQTY}
        />
      <EbaySearchTable
        results={state.ebaySearchResults}
        title={title}
        updateDataByPage={fetchEbayData}
        />
    </div>
  )
};

const EbayCardSearchContainer = compose(
  withState('state', 'setState', {
    ebaySearchResults: {},
    sortOrder: 'EndTimeSoonest',
    filter: '',
    qty: 100

  })
)(EbayCardSearchContainerBase);

export default connect(state => state)(EbayCardSearchContainer);
