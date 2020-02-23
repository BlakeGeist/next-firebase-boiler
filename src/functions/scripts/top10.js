const admin = require('firebase-admin')
const _ = require('lodash')
const axios = require('axios')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(require('../credentials/server'))
  }, 'server' )

firebaseAdmin.firestore().collection("sets").get()
  .then((snap) =>{
    sets = snap.docs.map(d => d.data());
    sets.forEach(async set => {
      await setTimeout(async function(){
        if(set.set_type === 'core' || set.set_type === 'expansion') {
          const cardCollections = firebaseAdmin.firestore().collection("cards").where('set', '==', set.code)
          let cards;
          await cardCollections.get()
            .then((snap) =>{
              cards = snap.docs.map(d => d.data());
              cards = _.orderBy(cards, ['prices.usd', 'prices.usd_foil'], 'desc');
              cards.forEach(async card => {

                if(card.prices && parseInt(card.prices.usd) > 500 ) {
                  console.log(card.name)
                  console.log(parseInt(card.prices.usd))
                  console.log(card.prices.usd_foil)

                  await setTimeout(async function(){
                    let params = {
                      'SECURITY-APPNAME': 'BlakeGei-standard-PRD-ee6e394ea-800e1243',
                      'OPERATION-NAME': 'findCompletedItems',
                      'SERVICE-VERSION': '1.0.0',
                      'RESPONSE-DATA-FORMAT': 'JSON',
                      'REST-PAYLOAD': '',
                      'paginationInput.entriesPerPage': '100',
                      'GLOBAL-ID': 'EBAY-US',
                      'siteid': '0',
                      'keywords': '"' + card.name + '"',
                      'sortOrder': 'PricePlusShippingLowest',
                      'categoryId': '38292',
                      'paginationInput.pageNumber': '1',
                    }

                    let filters = [];

                    filters.push({name: 'SoldItemsOnly', value: true})

                    filters.forEach((filter, i)=>{
                      params['itemFilter.name('+i+')'] = filter.name
                      params['itemFilter.value('+i+')'] = filter.value
                    })

                    await axios({
                      url: 'https://svcs.ebay.com/services/search/FindingService/v1',
                      params: params
                    }).then(function(response) {
                      return response
                    }).then((json) => {
                      const data = json.data[Object.keys(json.data)[0]][0];
                      console.log(card.name)
                      console.log(data.paginationOutput[0].totalEntries[0])
                      const cardRef = firebaseAdmin.firestore().collection("cardsWithEbaySales").doc(card.id)
                      card.ebaySalesCount = parseInt(data.paginationOutput[0].totalEntries[0])
                      cardRef.set(card)
                    }).catch(function(ex) {
                      console.log('parsing failed', ex)
                    })
                  }, 500);

                }

              })
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }, 500);
    })
  })
  .catch((err) => {
    console.log(err)
  })
