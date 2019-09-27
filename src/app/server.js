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

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
