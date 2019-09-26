const EbayCardSearchInputs = ({ fetchEbayData, updateFilter, updateSortOrder, updateQTY }) => {

  const selects = [
    {
      label: "Filter",
      onChange: updateFilter,
      values: [
        { label: "None", value: "" },
        { label: "Auction", value: "Auction" },
        { label: "FixedPrice", value: "FixedPrice" },
        { label: "StoreInventory", value: "StoreInventory" },
        { label: "AuctionWithBIN", value: "AuctionWithBIN" },
      ]
    },
    {
      label: "Sort By",
      onChange: updateSortOrder,
      values: [
        { label: "EndTimeSoonest", value: "EndTimeSoonest" },
        { label: "BestMatch", value: "BestMatch" },
        { label: "CurrentPriceHighest", value: "CurrentPriceHighest" },
        { label: "PricePlusShippingHighest", value: "PricePlusShippingHighest" },
        { label: "PricePlusShippingLowest", value: "PricePlusShippingLowest" },
        { label: "StartTimeNewest", value: "StartTimeNewest" },
        { label: "WatchCountDecreaseSort", value: "WatchCountDecreaseSort" }
      ]
    },
    {
      label: "QTY",
      onChange: updateQTY,
      values: [
        { label: "100", value: "100" },
        { label: "50", value: "50" },
        { label: "25", value: "25" }
      ]
    }
  ]

  const RenderSelects = ({ selects }) =>{
    return (
      <>
        {selects.map((select, i) => {
          return <RenderSelect key={i} selectOptions={select} />
        })}
      </>
    )
  }

  const RenderSelect = ({ selectOptions }) => {
    const { label, onChange, values } = selectOptions;
    return (
      <div className="ebay-search-inputs-input">
        <div><label>{label}</label></div>
        <select onChange={e => onChange(e)}>
          {values.map((selectItem, i) => {
            return <option key={i} value={selectItem.value}>{selectItem.label}</option>
          })}
        </select>
      </div>
    )
  }

  return (
    <div className="ebay-seach-inputs-wrapper">
      <div className="ebay-seach-inputs">
        <div className="ebay-search-inputs-input">
          <div><label>Filter</label></div>
          <select onChange={updateFilter}>
            <option value="">None</option>
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
      <style global jsx>{`
        .ebay-seach-inputs-wrapper{
          display: flex;
          justify-content: center;
        }
          .ebay-seach-inputs {
            align-items: center;
            display: flex;
            justify-content: space-around;
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
