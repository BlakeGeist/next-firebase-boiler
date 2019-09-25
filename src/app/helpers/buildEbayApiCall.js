module.exports = function (options) {
  const apiBase = 'https://svcs.ebay.com/services/search/FindingService/v1?'

  let configs = {
    'SECURITY-APPNAME': 'BlakeGei-standard-PRD-ee6e394ea-800e1243',
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.0.0',
    'RESPONSE-DATA-FORMAT': 'JSON&REST-PAYLOAD',
    'keywords': '',
    'sortOrder': 'PricePlusShippingLowest',
    'categoryId': '38292',
    'paginationInput.entriesPerPage': '100',
    'GLOBAL-ID': 'EBAY-US',
    'siteid': '0'
  }

  if(options){
    const optionsKeys = Object.keys(options);
    optionsKeys.forEach((option) => {
      configs[option] = options[option]
    });
  }

  const configKeys = Object.keys(configs);
  let builtApiCall = apiBase;
  configKeys.forEach((config)=>{
    builtApiCall += config + '=' + configs[config] + '&'
  })

  return builtApiCall
}

//https://developer.ebay.com/DevZone/finding/CallRef/types/SortOrderType.html
