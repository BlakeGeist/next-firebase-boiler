import React from 'react'
const { filterOutliers,  getAverage, roundMoney, firstNumber, priceByQTY } = require("../helpers/quickHelpers");

const EbaySearchTable = ({ title, results, avgPrice, avgPriceAfterOutliers, avgFoilPrice, updateDataByPage }) => {

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
    const fish = parseFloat(priceByQTY(firstNumber(resultTitle), price).replace(/[$,]+/g,""));
    const cow = parseFloat(price)
    let highlight = '';
    if(foilMod.length > 0){
      highlight = (avgFoilPrice > fish) ? 'highlight' : '';
    } else {
      highlight = (avgPrice > fish) ? 'highlight' : '';
    }
    return (
      <tr key={i} className={`${foilMod} ${sellsToday}`}>
        <td>{i+1}</td>
        <td><a href={result.viewItemURL[0]} target="_blank">{resultTitle}</a></td>
        <td>${price}</td>
        <td>{result.listingInfo[0].listingType}</td>
        <td>{myDate.toDateString()}</td>
        <td>{firstNumber(resultTitle)}</td>
        <td className={highlight}>{priceByQTY(firstNumber(resultTitle), price)}</td>
      </tr>
    )
  }

  function paginationClick(e) {
    e.preventDefault()
    updateDataByPage(e.target.dataset.paginate)
  }

  const Pageination = () => {
    let pagesArray = [];

    for(let i = 0; i < results.paginationOutput.totalPages; i++) {
      pagesArray.push(<a href="" onClick={paginationClick} data-paginate={i+1} key={i}>{i+1}</a>)
    }
    return pagesArray
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {results && results.paginationOutput &&
          <div>
            <div>Page Number: {results.paginationOutput.pageNumber}</div>
            <div>Total Pages: {results.paginationOutput.totalPages}</div>
            <div>Total Entries: {results.paginationOutput.totalEntries}</div>
            <div className="pagination-container"><Pageination /></div>
            <style global jsx>{`
                .pagination-container{
                  display: flex;
                  justify-content: center;
                }
                .pagination-container a {
                  border: 1px solid #ccc;
                  height: 25px;
                  width: 25px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
              `}</style>
          </div>
        }
      </div>
      <table>
        <tbody>
          <tr>
            <th>avgPrice</th>
            <th>avgPriceAfterOutliers</th>
            <th>avgFoilPrice</th>
          </tr>
          <tr>
            <td>{avgPrice}</td>
            <td>{avgPriceAfterOutliers}</td>
            <td>{avgFoilPrice}</td>
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
          {results.data.map((result, i) => renderEbaySearchResult(result, i))}
        </tbody>
      </table>
    </div>
  )
};

export default EbaySearchTable;
