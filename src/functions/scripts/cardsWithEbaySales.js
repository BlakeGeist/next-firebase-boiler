const admin = require('firebase-admin')
const _ = require('lodash')
const axios = require('axios')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(require('../credentials/server'))
  }, 'server' )

firebaseAdmin.firestore().collection("cards").orderBy("ebaySalesCount", "asc").get().then(function(snap) {
  cards = snap.docs.map(d => d.data());
  console.log(cards)
  cards.forEach(card => {
    console.log(card)
  })
});
