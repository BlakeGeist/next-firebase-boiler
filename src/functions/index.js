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

const firebaseAdmin = admin.initializeApp(
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
         database: firebaseAdmin.firestore()
    }),
    name: '__session',
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

  const token = req.body.token;

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

server.post('/api/translate', (req, res) => {
  stringsModule.handler(req, res);
})

server.get('*', (req, res) => {
  return handle(req, res)
})

exports.app = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare().then(() => {
    server(req, res);
  })

});
