import React from 'react'

const EbayCardSearchInputs = ({ fetchEbayData, updateFilter, updateSortOrder, updateQTY }) => {
  return (
    <div className="ebay-seach-inputs-wrapper">
      <div className="ebay-seach-inputs">
        <div className="ebay-search-inputs-input">
          <div><label>Filter</label></div>
          <select onChange={updateFilter}>
            <option value="">Filter By Auction Type</option>
            <option value="Auction">Auction</option>
            <option value="FixedPrice">FixedPrice</option>
            <option value="StoreInventory">StoreInventory</option>
            <option value="AuctionWithBIN">AuctionWithBIN</option>
          </select>
        </div>
        <div className="ebay-search-inputs-input">
          <div><label>Sort By</label></div>
          <select onChange={updateSortOrder}>
            <option value="EndTimeSoonest">EndTimeSoonest</option>
            <option value="BestMatch">BestMatch</option>
            <option value="CurrentPriceHighest">CurrentPriceHighest</option>
            <option value="PricePlusShippingHighest">PricePlusShippingHighest</option>
            <option value="PricePlusShippingLowest">PricePlusShippingLowest</option>
            <option value="StartTimeNewest">StartTimeNewest</option>
            <option value="WatchCountDecreaseSort">WatchCountDecreaseSort</option>
          </select>
        </div>
        <div className="ebay-search-inputs-input">
          <div>QTY</div>
          <select onChange={updateQTY}>
            <option value="100">100</option>
            <option value="50">50</option>
            <option value="25">25</option>
          </select>
        </div>
        <div className="ebay-search-inputs-input">
          <div>Submit</div>
          <button onClick={(e) => fetchEbayData(1, e)}>Ebay Info</button>
        </div>
      </div>
      <style jsx>{`
        .ebay-seach-inputs-wrapper{
          display: flex;
          justify-content: center;
        }
          .ebay-seach-inputs {
            align-items: center;
            display: flex;
            justify-content: space-around
          }
            .ebay-search-inputs-input {
              padding: 0 5px;
              text-align: left;
            }
      `}</style>
    </div>
  )
};

export default EbayCardSearchInputs;
