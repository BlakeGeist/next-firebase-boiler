const admin = require('firebase-admin')
const _ = require('lodash')
const axios = require('axios')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(require('../credentials/server'))
  }, 'server' )

firebaseAdmin.firestore().collection("cards").orderBy("ebaySalesCount", "asc").get()
  .then(function(snap) {
    cards = snap.docs.map(d => d.data());
    cards.forEach(card => {
      const apiCall = `http://partner.tcgplayer.com/x3/phl.asmx/p?pk=StandardMTGCards&s=${encodeURIComponent(card.set_name)}&p=${encodeURIComponent(card.name)}`

      setTimeout(function(){
        axios({
          url: apiCall,
        })
          .then(res => {
            console.log('successfully did a thing ', res.data)
          })
          .catch(err => {
            console.log('oh shit, you fucked up son')
            console.log(err)
          })
      }, 500);
    })
    return
  })
  .catch(err => console.log(err))
