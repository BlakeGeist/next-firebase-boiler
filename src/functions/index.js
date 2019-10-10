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

  axios({
  		method: 'POST',
  		url: 'https://api.ebay.com/identity/v1/oauth2/token',
  		headers: {
  			'Content-Type': 'application/x-www-form-urlencoded',
  			'Accept': 'application/json',
  			'Cache-Control': 'no-cache',
  			'Authorization': 'Basic Qmxha2VHZWktc3RhbmRhcmQtUFJELWVlNmUzOTRlYS04MDBlMTI0MzpQUkQtYmZmM2ZlNDRmMGVhLTA5YWUtNDcwZi05MjIyLTZlMmM='
  		},
  		data: qs.stringify({
  			'grant_type': 'authorization_code',
  			'redirect_uri': 'Blake_Geist-BlakeGei-standa-oysusnr',
  			'code': token
  		})
  	})
  	.then((response) => {
      console.log(response)
      console.log(response.data)
      console.log(response.data.access_token)
      console.log('BlakeBlake')
      axios({
      		method: 'POST',
      		url: 'https://api.ebay.com/wsapi',
      		headers: {
      			'Content-Type': 'application/x-www-form-urlencoded',
      			'Accept': 'application/json',
      			'Cache-Control': 'no-cache',
            'Authorization': 'IAF ' + response.data.access_token,
            'SOAPAction': 'GetUser'
      		},
          params: qs.stringify({
      			'callname': 'GetUser',
            'version': '1085',
            'siteid': 0,
            'IAF-TOKEN': response.data.access_token
      		})
      	})
        .then((response) => {
          console.log(response)
          console.log('blakeblakeblake')
        })
        .catch((error) => {
          console.log(error)
          console.log('argg fuck')
        })
    })
  	.catch((error) => {
      console.log(error)
    })

  //token = token.substr(token.indexOf("t^") + 2);

  res.redirect('/')

  return

  firebase
    .auth()
    .createCustomToken(token)
    .then(function(customToken) {
      // Send token back to client
      req.session.decodedToken = customToken
      firebase2.auth().signInWithCustomToken(customToken)
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

server.get('*', (req, res) => {
  return handle(req, res)
})

exports.app = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare().then(() => {
    server(req, res);
  })

});

exports.importSets = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {


  });
});
