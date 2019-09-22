import React from 'react'

const EbaySearchTable = ({ title, results, avgPrice, avgPriceAfterOutliers }) => {

  const renderEbaySearchResult = (result, i) => {
    const date = result.listingInfo[0].endTime;
    let myDate;
    if(date){
      myDate = new Date(date);
    }
    const resultTitle = result.title[0].toLowerCase();
    const sellsToday = (myDate.toDateString() == new Date().toDateString()) ? 'mod-sells-today' : '';
    const foilMod = (resultTitle.includes('foil') || resultTitle.includes('promo')) ? 'mod-foil' : '';
    const price = result.sellingStatus[0].currentPrice[0].__value__;
    return (
      <tr key={i} className={`${foilMod} ${sellsToday}`}>
        <td>{i+1}</td>
        <td><a href={result.viewItemURL[0]} target="_blank">{resultTitle}</a></td>
        <td>${price}</td>
        <td>{result.listingInfo[0].listingType}</td>
        <td>{myDate.toDateString()}</td>
        <td>{firstNumber(resultTitle)}</td>
        <td>{priceByQTY(firstNumber(resultTitle), price)}</td>
      </tr>
    )
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
    <div>
      <h2>{title}</h2>
      <table>
        <tbody>
          <tr>
            <th>
              avgPrice
            </th>
            <th>
              avgPriceAfterOutliers
            </th>
          </tr>
          <tr>
          <td>{avgPrice}</td>
          <td>{avgPriceAfterOutliers}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>Index</th>
            <th>Ebay Link</th>
            <th>Sell Price</th>
            <th>ListingType</th>
            <th>Sell Date</th>
            <th>QTY</th>
            <th>Price per QTY</th>
          </tr>
          {results.map((result, i) => renderEbaySearchResult(result, i))}
        </tbody>
      </table>
    </div>
  )
};

export default EbaySearchTable;
