import React from 'react'
const { filterOutliers,  getAverage, roundMoney, firstNumber, priceByQTY } = require("../../helpers/quickHelpers");

const EbaySearchTable = ({ title, results, updateDataByPage, updateSort, sortOrder }) => {

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
      highlight = (results.avgFoilPrice > fish) ? 'highlight' : '';
    } else {
      highlight = (results.avgPrice > fish) ? 'highlight' : '';
    }
    return (
      <tr key={i} className={`ebay-listing ${foilMod} ${sellsToday}`}>
        <td className="ebay-listing-index">{i+1}</td>
        <td className="ebay-listing-title"><a href={result.viewItemURL[0]} target="_blank">{resultTitle}</a></td>
        <td>${price}</td>
        <td>{result.listingInfo[0].listingType}</td>
        <td className="ebay-listing-date">{myDate.toDateString()}</td>
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
      let isActive = (results.paginationOutput.pageNumber[0] === (i+1).toString() ? 'isActive' : '')
      pagesArray.push(<a className={isActive} href="" onClick={paginationClick} data-paginate={i+1} key={i}>{i+1}</a>)
    }
    return pagesArray
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {results && results.paginationOutput &&
          <div>
            <div>Total Listings: {results.paginationOutput.totalEntries}</div>
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
                .pagination-container a.isActive {
                  background-color: yellow;
                }
                .ebay-listing:hover{
                  background-color: #70fd7b;
                }
                  .ebay-listing td{
                    padding: 0 5px;
                  }
                  .ebay-listing-index{
                    text-align: center;
                  }
                  .ebay-listing-date{
                    min-width: 130px;
                  }
                  .ebay-listing-title{
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  }
              `}</style>
          </div>
        }
      </div>
      <table>
        <tbody>
          <tr>
            <th>avgPrice</th>
            <th>avgFoilPrice</th>
          </tr>
          <tr>
            <td>{results.avgPrice}</td>
            <td>{results.avgFoilPrice}</td>
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
          {results.data && results.data.map((result, i) => renderEbaySearchResult(result, i))}
        </tbody>
      </table>
    </div>
  )
};

export default EbaySearchTable;
