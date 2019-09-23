const next = require('next');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
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

server.get('/api/oauthEbay', async (req, res) => {
  let token = req.query.code
  if (!firebase2.apps.length) {
    firebase2.initializeApp(require('./credentials/client'))
  };

  console.log(token)
  console.log('findme blake')
  if (!firebase2.apps.length) {
    firebase2.initializeApp(require('../functions/credentials/client'))
  };

  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic Qmxha2VHZWktc3RhbmRhcmQtUFJELWVlNmUzOTRlYS04MDBlMTI0MzpQUkQtYmZmM2ZlNDRmMGVhLTA5YWUtNDcwZi05MjIyLTZlMmM='
  }

  const decodedURIToken = decodeURI(token)
  const encodedToken = encodeURI(decodedURIToken);
  await axios({
    method: 'post',
    url: 'https://api.ebay.com/identity/v1/oauth2/token?redirect_uri=Blake_Geist-BlakeGei-standa-oysusnr&code='+encodedToken,
    headers: headers
  })
    .then((response) =>{

      const setKeys = Object.keys(response)

      setKeys.forEach((response)=>{
        console.log(response)
      })

      console.log(response.data)
      console.log(response.request)

      console.log('ebay response')
      console.log(response)
    })
    .catch(function(error) {
      console.log('ebay error')
      console.log(error)
      console.log(error.response)
      const setKeys = Object.keys(error.response)

      setKeys.forEach((response)=>{
        console.log(response)
      })

      console.log(error.data)

    })

  //token = token.substr(token.indexOf("t^") + 2);

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

server.get('*', (req, res) => {
  return handle(req, res)
})

exports.app = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare().then(() => {
    server(req, res);
  })

});
