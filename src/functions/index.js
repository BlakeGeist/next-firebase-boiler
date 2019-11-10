const next = require('next');
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const session = require('express-session')
const FirestoreStore = require('firestore-store')(session)
const admin = require('firebase-admin')
var dir = __dirname
const nextApp = next({ dev: false, dir, conf: { distDir: 'public' } });
const handle = nextApp.getRequestHandler();
const axios = require('axios');
const qs = require('qs');
const  _ = require('lodash');

const firebase2 = require('firebase');

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(require('./credentials/server'))
  },
  'server'
)

const server = express();
server.use(cors());
server.use(bodyParser.json())
server.use(
  session({
    secret: 'geheimnis',
    saveUninitialized: true,
    store: new FirestoreStore({
         database: firebase.firestore()
    }),
    name: '__session',
    resave: false,
    rolling: true,
    httpOnly: true,
    cookie: { maxAge: 604800000 } // week
  })
)

server.use((req, res, next) => {
  req.firebaseServer = firebase
  next()
})

server.post('/api/login', (req, res) => {
  if (!req.body) return res.sendStatus(400)

  const token = req.body.token;

  firebase
    .auth()
    .verifyIdToken(token)
    .then(decodedToken => {
      req.session.decodedToken = decodedToken
      return decodedToken
    })
    .then(decodedToken => res.json({ status: true, decodedToken }))
    .catch(error => res.json({ error }))
})

server.post('/api/logout', (req, res) => {
  req.session.decodedToken = null
  res.json({ status: true })
})

server.get('/api/usersCardCollection/add', (req, res) => {
  const cardCollections = firebase.firestore().collection("userCardCollections")

  if(req.session && req.session.decodedToken) {
    const uid = req.session.decodedToken.uid;
    const usersCardCollections = cardCollections.doc(uid);

    usersCardCollections.collection('cards').doc(req.query.id).set(req.query)
      .then(function() {
        console.log("Card successfully added!");
        res.json({ status: 200, data: req.query.id + ' card was added' })
      })
      .catch(function(error) {
        console.error("Error removing document: ", error);
      });

  } else {
    res.json({ mesage: 'NO USER FOUND' })
  }
})

server.get('/api/getEbaySearchData', (req, res) => {
  axios({
    url: 'https://svcs.ebay.com/services/search/FindingService/v1',
    params: req.query
  }).then(function(response) {
    return response
  }).then((json) => {
    const data = json.data[Object.keys(json.data)[0]][0];
    res.json(data)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
});

server.get('/api/oauthEbay', async (req, res) => {
  let token = req.query.code
  if (!firebase2.apps.length) {
    firebase2.initializeApp(require('./credentials/client'))
  };

  console.log(req.session.ebaySessionId)
  console.log('blakeFind1')

  var str = `
  <?xml version="1.0" encoding="utf-8"?>
  <FetchTokenRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <SessionID>` + req.session.ebaySessionId + `</SessionID>
  </FetchTokenRequest>
  `

  axios({
    method: 'POST',
    url: 'https://api.ebay.com/ws/api.dll',
    headers: {
      'X-EBAY-API-SITEID': '0',
      'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
      'X-EBAY-API-CALL-NAME': 'FetchToken',
      'X-EBAY-API-APP-NAME': 'BlakeGei-standard-PRD-ee6e394ea-800e1243',
      'X-EBAY-API-DEV-NAME': 'a036b866-4e0d-49de-b7f6-a45309064be2',
      'X-EBAY-API-CERT-NAME': 'PRD-bff3fe44f0ea-09ae-470f-9222-6e2c'
    },
    data: str
  })
    .then(async (data) => {
      const response = await xmlToJson(data)

      const token = response.FetchTokenResponse.eBayAuthToken[0]

      req.session.eBayAuthToken = token
      res.redirect('/')

    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })

})

server.get('/api/importSets', (req, res) => {
  if (!firebase2.apps.length) {
    firebase2.initializeApp(require('./credentials/client'))
  };

  const db = firebase2.app().firestore();
  const cardsCollection = db.collection('sets');

  axios.get('https://api.scryfall.com/sets')
    .then(async (resp) => {
      const sets = resp.data.data;
      let proms = []
      _.each(sets, function(set){
        proms.push(
          cardsCollection.doc(set.code).set(set)
            .then(()=>{
              console.log('successfully imported ', set.name)
            })
           .then((set)=>{
             return set
           })
           .catch((err)=>{
             console.log('error: ', err)
           })
        )
      });
      await Promise.all(proms)
      res.status(200).send(sets)
    })
    .catch((err)=>{
      console.log('error: ', err)
    });
})

server.get('/api/importCardsFromSet', async (req, res) => {

  console.log('starting importCardsFromSet')

  let set = req.query.set

  let cards = [];
  let page = 1;

  let response = await axios.get('https://api.scryfall.com/cards/search?q=s:'+set+'&order=color&unique=prints');

  cards = cards.concat(response.data.data)

  while(response.data.has_more) {
    page++;
    response = await axios.get('https://api.scryfall.com/cards/search?q=s:'+set+'&page='+page+'&order=color&unique=prints');
    cards = cards.concat(response.data.data);
  }

  let proms = []

  if (!firebase2.apps.length) {
    firebase2.initializeApp(require('./credentials/client'))
  };

  const db = firebase2.app().firestore();
  const cardsCollection = db.collection('cards');

  const setDoc = db.collection('sets').doc(set);

  await setDoc.update({hasCards: true})
    .catch((err) => console.log(err))

  cards.forEach((card, i) => {
    card.prices.usd = parseFloat(card.prices.usd) * 100 || 0
    card.prices.usd_foil = parseFloat(card.prices.usd_foil) * 100 || 0
    proms.push(
      cardsCollection.doc(card.id).set(card)
       .then(()=>{
         console.log('successfully imported ', card.name)
       })
       .then((card)=>{
         return card
       })
       .catch((err)=>{
         console.log('error: ', err)
       })
    )
  })

  await Promise.all(proms)
  res.status(200).send(cards)
})

server.post('/api/linkEbayAccount', (req, res) => {

  var str = `
    <?xml version="1.0" encoding="utf-8"?>
    <GetSessionIDRequest xmlns="urn:ebay:apis:eBLBaseComponents">
      <RuName>Blake_Geist-BlakeGei-standa-xrzudr</RuName>
    </GetSessionIDRequest>
  `

  axios({
      method: 'POST',
      url: 'https://api.ebay.com/ws/api.dll',
      headers: {
        'X-EBAY-API-SITEID': '0',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-CALL-NAME': 'GetSessionID',
        'X-EBAY-API-APP-NAME': 'BlakeGei-standard-PRD-ee6e394ea-800e1243',
        'X-EBAY-API-DEV-NAME': 'a036b866-4e0d-49de-b7f6-a45309064be2',
        'X-EBAY-API-CERT-NAME': 'PRD-bff3fe44f0ea-09ae-470f-9222-6e2c'
      },
      data: str
    })
      .then(async (data) => {
        const response = await xmlToJson(data)
        const sessionId = response.GetSessionIDResponse.SessionID[0];
        req.session.ebaySessionId = sessionId;
        res.status(200).send(sessionId)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })

})

server.post('/api/sellCard', (req, res) => {

  console.log(req.session.eBayAuthToken)

  var str = `
  <?xml version="1.0" encoding="utf-8"?>
  <AddItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">
    <RequesterCredentials>
      <eBayAuthToken>` + req.session.eBayAuthToken + `</eBayAuthToken>
    </RequesterCredentials>
    <ErrorLanguage>en_US</ErrorLanguage>
    <WarningLevel>High</WarningLevel>
    <Item>
      <Title>Harry Potter and the Philosopher's Stone</Title>
      <Description>
        This is the first book in the Harry Potter series. In excellent condition!
      </Description>
      <PrimaryCategory>
        <CategoryID>377</CategoryID>
      </PrimaryCategory>
      <StartPrice>1.0</StartPrice>
      <CategoryMappingAllowed>true</CategoryMappingAllowed>
      <ConditionID>4000</ConditionID>
      <Country>US</Country>
      <Currency>USD</Currency>
      <DispatchTimeMax>3</DispatchTimeMax>
      <ListingDuration>Days_7</ListingDuration>
      <ListingType>Chinese</ListingType>
      <PaymentMethods>PayPal</PaymentMethods>
      <PayPalEmailAddress>blakesmtg@gmail.com</PayPalEmailAddress>
      <PictureDetails>
        <PictureURL>https://img.scryfall.com/cards/normal/front/5/7/57645743-27fa-4a75-9511-acfc32dd349a.jpg?1571699733</PictureURL>
      </PictureDetails>
      <PostalCode>95125</PostalCode>
      <Quantity>1</Quantity>
      <ReturnPolicy>
        <ReturnsAcceptedOption>ReturnsAccepted</ReturnsAcceptedOption>
        <RefundOption>MoneyBack</RefundOption>
        <ReturnsWithinOption>Days_30</ReturnsWithinOption>
        <ShippingCostPaidByOption>Buyer</ShippingCostPaidByOption>
      </ReturnPolicy>
      <ShippingDetails>
        <ShippingType>Flat</ShippingType>
        <ShippingServiceOptions>
          <ShippingServicePriority>1</ShippingServicePriority>
          <ShippingService>USPSMedia</ShippingService>
          <ShippingServiceCost>2.50</ShippingServiceCost>
        </ShippingServiceOptions>
      </ShippingDetails>
      <Site>US</Site>
    </Item>
  </AddItemRequest>
  `


  axios({
      method: 'POST',
      url: 'https://api.ebay.com/ws/api.dll',
      headers: {
        'X-EBAY-API-SITEID': '0',
        'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
        'X-EBAY-API-CALL-NAME': 'AddItem'
      },
      data: str
    })
      .then(async data => {
        const response = await xmlToJson(data)

        const error = response.AddItemResponse.Errors;

        console.log(response);
        console.log(error);
        console.log('blakeblake')
        res.status(200).send(response)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send(err)
      })


})

server.get('*', (req, res) => {
  return handle(req, res)
})


async function xmlToJson(xml) {

  const {parseString} = require('xml2js');

  await parseString(xml.data, async function (err, result) {
      xml = await result
  });

  return xml

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


exports.app = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare().then(() => {
    server(req, res);
  })

});
