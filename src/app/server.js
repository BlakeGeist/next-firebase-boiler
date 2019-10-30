const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const next = require('next')
const admin = require('firebase-admin')
const axios = require('axios');
const buildEbayApiCall = require('./helpers/buildEbayApiCall');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

//wtf does server do here?
const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(require('../functions/credentials/server'))
  }, 'server' )

const firebase = require('firebase');

const initedFirebase = firebase.initializeApp(require('../functions/credentials/client'))

var cors = require('cors');
const _ = require('lodash');


app.prepare().then(() => {
  const server = express()

  server.use(cors());

  server.use(bodyParser.json())
  server.use(
    session({
      secret: 'geheimnis',
      saveUninitialized: true,
      store: new FileStore({ secret: 'geheimnis' }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 } // week
    })
  )

  server.use((req, res, next) => {
    req.firebaseServer = firebaseAdmin
    next()
  })

  server.post('/api/login', (req, res) => {
    if (!req.body) return res.sendStatus(400)

    const token = req.body.token
    firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        req.session.decodedToken = decodedToken
        return decodedToken
      })
      .then(decodedToken => res.json({ status: true, decodedToken }))
      .catch(error => res.json({ error }))
  })

  server.post('/api/sellCard', (req, res) => {

    var str = `<?xml version="1.0" encoding="utf-8"?>
<GeteBayOfficialTimeRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>AgAAAA**AQAAAA**aAAAAA**iiSyXQ**nY+sHZ2PrBmdj6wVnY+sEZ2PrA2dj6wFk4GjDJWBpQ6dj6x9nY+seQ**1u0DAA**AAMAAA**/fGGZJ1ZTDXt2xsnuCKjLCFLrIycDkrF8DXxot32D/iI6HaA9sygNtRqPPgdEjycDYyWZLeEfGivIeT+tDMBl8AXHC5wNyjvtCzixzaLvF4VkKdpvUpD02ZLO1crgfnxf2Kvf8KX34mtg0sd3U/YDGfaQwNE7NGwSBjTXg8dYaT+GpzMEoiS/af64/TK4CKbslSiB7NvTetK3GIgTEDQkRuzuRSAsvJrhe7klSpKSBOo5AOg6glc0RCXFQ1zPRbBuAiXHZD/9eYyCm5iEJx0pGmLAJvgVJzRiNjEFtTo4MQ19R5ylBiw4f3UGYkP87FF2DMpr0uAuZL1mUS5wuT2es25okVS1oFVzgsxpoeELaeMO+px1zzk64Tm5qQnYFusb5mZwl7RiAfTtzOujqPhCrcuawXch1LTonNnI5ec1anP362fyI4m6zG17ENDyjYrU/a6gYeBcX4lcytCc8XNtkax18f04H2+XXoGzCuh6lWtpPyAM4fczqOzeLWI6s4yUKgb8ShRJF2qiSFJFGH89RCAsRmOE6RTSYsIEjxfhvQe10DxDYrLFOJIUOEt/ilR/s5Nfr+bPTAWs+HihvNKKwPfin5CJrxJOnX5H9nKTDGu/MR2k2ISTeeoFA9meexOjmCUR8jiMqTn7E0qTmuhYBa8zXbBda3XbcxttGkzrZaq5LDYWUhYg/gj5gIxoiyvlnJnQF5kJGf6EAENkiAbWq1jUGJWmq/3oHUb1pBV2gJxiKB262mTtj+sIur0f8as</eBayAuthToken>
  </RequesterCredentials>
	<ErrorLanguage>en_US</ErrorLanguage>
	<WarningLevel>High</WarningLevel>
</GeteBayOfficialTimeRequest>`

    axios({
        method: 'POST',
        url: 'https://api.sandbox.ebay.com/ws/api.dll',
        headers: {
          'X-EBAY-API-SITEID': '0',
          'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
          'X-EBAY-API-CALL-NAME': 'GeteBayOfficialTime'
        },
        data: str
      })
        .catch((err) => {
          console.log(err)
          res.status(500).send(err)
        })


  })

  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null
    res.json({ status: true })
  })

  server.post('/api/linkEbayAccount', (req, res) => {


    var str = `
      <?xml version="1.0" encoding="utf-8"?>
      <GetSessionIDRequest xmlns="urn:ebay:apis:eBLBaseComponents">
        <RuName>Blake_Geist-BlakeGei-standa-bvslpr</RuName>
      </GetSessionIDRequest>
    `

    axios({
        method: 'POST',
        url: 'https://api.sandbox.ebay.com/ws/api.dll',
        headers: {
          'X-EBAY-API-SITEID': '0',
          'X-EBAY-API-COMPATIBILITY-LEVEL': '967',
          'X-EBAY-API-CALL-NAME': 'GetSessionID',
          'X-EBAY-API-APP-NAME': 'BlakeGei-standard-SBX-5e6e394ea-29d730e6',
          'X-EBAY-API-DEV-NAME': 'a036b866-4e0d-49de-b7f6-a45309064be2',
          'X-EBAY-API-CERT-NAME': 'SBX-e6e394ea763e-b466-4f1c-9f4e-f991	'
        },
        data: str
      })
        .then(async (data) => {
          const response = await xmlToJson(data)
          const sessionId = response.GetSessionIDResponse.SessionID[0];
          res.status(200).send(sessionId)
        })
        .catch((err) => {
          console.log(err)
          res.status(500).send(err)
        })

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

  server.get('/api/oauthEbay',  (req, res) => {
    let token = req.query.code;
    console.log(token)
    console.log('findme blake')
    if (!firebase.apps.length) {
      firebase.initializeApp(require('../functions/credentials/client'))
    };

    var headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic Qmxha2VHZWktc3RhbmRhcmQtUFJELWVlNmUzOTRlYS04MDBlMTI0MzpQUkQtYmZmM2ZlNDRmMGVhLTA5YWUtNDcwZi05MjIyLTZlMmM='
    }
    const decodedURIToken = decodeURI(token)
    const encodedToken = encodeURI(decodedURIToken);
    axios({
      method: 'post',
      url: 'https://api.ebay.com/identity/v1/oauth2/token?grant_type=authorization_code&redirect_uri=Blake_Geist-BlakeGei-standa-oysusnr&code='+decodedURIToken,
      headers: headers
    })
      .then((response) =>{
        console.log('ebay response')
        console.log(response)
      })
      .catch(function(error) {
        console.log('ebay error')
        console.log(error)
      })


    if(req.session && req.session.decodedToken) {
      const uid = req.session.decodedToken.uid;

      var user = firebase.auth().currentUser;

      user.updateProfile({
        displayName: "Jane Q. User",
        photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(function() {
        res.redirect('/')

      }).catch(function(error) {
        // An error happened.
      });

    } else {
      res.json({ mesage: 'NO USER FOUND' })
    }

    return

    firebase
      .auth()
      .createCustomToken(token)
      .then(function(customToken) {
        // Send token back to client
        req.session.decodedToken = customToken
        firebase.auth().signInWithCustomToken(customToken)
        .then((data)=>{
          req.session.decodedToken = data.user
          res.redirect('/')
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
        });
      })
      .catch(function(error) {
        console.log('Error creating custom token:', error);
      });

  })

  server.get('/api/importSets', (req, res) => {
    const db = firebase.app().firestore();
    const cardsCollection = db.collection('sets');

    axios.get('https://api.scryfall.com/sets')
      .then(async (resp) => {
        const sets = resp.data.data;
        let proms = []
        _.each(sets, function(set, i){
          set.index = i +1
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

    const db = firebase.app().firestore();
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

  server.get('/api/userSCardCollection', async (req, res) => {
    let cardIds = req.query.cardIds;
    console.log(cardIds)
    res.status(200).send(cardIds)
  })

  server.get('/api/top10FromSets', (req, res) => {
    axios.get('https://api.scryfall.com/sets')
      .then(resp => {
        const sets = resp.data.data;
        sets.forEach(async (set) => {
          setTimeout(function(){
            processSet(set)
          }, 1000);
        })
        res.status(200).send(sets)
      })
      .catch(err => console.log(err))
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})


// Changes XML to JSON
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

async function processSet(set) {
  let cards = [];
  let page = 1;

  let response = await axios.get('https://api.scryfall.com/cards/search?q=s:'+set.code+'&page='+page+'&order=color&unique=prints');

  cards = cards.concat(response.data.data)

  while(response.data.has_more) {
    page++;
    response = await axios.get('https://api.scryfall.com/cards/search?q=s:'+set.code+'&page='+page+'&order=color&unique=prints');
    cards = cards.concat(response.data.data);
  }

  let proms = []

  const db = firebase.app().firestore();
  const cardsCollection = db.collection('cards');

  const setDoc = db.collection('sets').doc(set.code);

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

  return await Promise.all(proms)
}
