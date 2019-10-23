import React from 'react'
import Select from 'react-select'


const EbayCardSearchInputs = ({ updateStateItemFromInput, setSearchPhrase, fetchEbayData, searchPhrase }) => {

  const selects = [
    {
      label: "Filter",
      value: "filter",
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
      value: "sortOrder",
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
      value: "qty",
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
    const { label, values } = selectOptions;
    return (
      <div className="ebay-search-inputs-input">
        <div><label>{label}</label></div>
        <Select
          options={values}
          onChange={e => updateStateItemFromInput(selectOptions.value, e)}
          menuPlacement="auto"
          menuPosition="fixed"
          isClearable
          />
      </div>
    )
  }
  //<select onChange={e => onChange(e)}>
    //{values.map((selectItem, i) => {
      //return <option key={i} value={selectItem.value}>{selectItem.label}</option>
    //})}
  //</select>

  const handleFetchEbayData = (e) => {
    e.preventDefault();
    fetchEbayData(1)
  }

  const handleSearchPhraseChange = (e) => {
    console.log(e.target.value)
    setSearchPhrase(e.target.value)
  }

  console.log(searchPhrase)

  return (
    <div className="ebay-seach-inputs-wrapper">
      <form className="ebay-seach-inputs" onSubmit={e => handleFetchEbayData(e)}>
        <div className="ebay-search-inputs-input">
          <div><label>Search</label></div>
          <input className="mod-input" type="text" onChange={e => handleSearchPhraseChange(e)} value={searchPhrase} />
        </div>

        {/*  <RenderSelects selects={selects} /> */}

        <div className="ebay-search-inputs-input" style={{flex: '0 1 150px'}}>
          <div><label>Filters</label></div>
          <Select
            options={selects[0].values}
            menuPlacement="auto"
            menuPosition="fixed"
            isClearable
            onChange={e => updateStateItemFromInput('filter', e)}
            />
        </div>
        <div className="ebay-search-inputs-input" style={{flex: '0 1 250px'}}>
          <div><label>Sort By</label></div>
          <Select
            options={selects[1].values}
            defaultValue={{ label: "EndTimeSoonest", value: 'EndTimeSoonest' }}
            menuPlacement="auto"
            menuPosition="fixed"
            onChange={e => updateStateItemFromInput('sortOrder', e)}
            />
        </div>
        <div className="ebay-search-inputs-input" style={{flex: '0 1 150px'}}>
          <div><label>Qty</label></div>
          <Select
            options={selects[2].values}
            defaultValue={{ label: "100", value: '100' }}
            menuPlacement="auto"
            menuPosition="fixed"
            onChange={e => updateStateItemFromInput('qty', e)}
            />
        </div>
        <div className="ebay-search-inputs-input">
          <div><label><br/></label></div>
          <input className="mod-input" style={{cursor: 'pointer'}} type="submit" value="Search Ebay"/>
        </div>
      </form>
      <style global jsx>{`
        .ebay-seach-inputs-wrapper{
          display: flex;
          justify-content: center;
        }
          .ebay-seach-inputs {
            align-items: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
          }
            .ebay-search-inputs-input {
              padding: 0 5px;
              text-align: left;
            }
            .mod-input{
              padding: 0 10px;
              font-size: 16px;
              -ms-flex-align: center;
              align-items: center;
              background-color: hsl(0,0%,100%);
              border-color: hsl(0,0%,80%);
              color: hsl(0, 6%, 38%);
              border-radius: 4px;
              border-style: solid;
              border-width: 1px;
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              -webkit-flex-wrap: wrap;
              -ms-flex-wrap: wrap;
              flex-wrap: wrap;
              -webkit-box-pack: justify;
              -webkit-justify-content: space-between;
              -ms-flex-pack: justify;
              -webkit-box-pack: justify;
              -webkit-justify-content: space-between;
              -ms-flex-pack: justify;
              justify-content: space-between;
              min-height: 38px;
              outline: 0 !important;
              position: relative;
              -webkit-transition: all 100ms;
              -webkit-transition: all 100ms;
              transition: all 100ms;
              box-sizing: border-box;
            }
      `}</style>
    </div>
  )
};

export default EbayCardSearchInputs;
