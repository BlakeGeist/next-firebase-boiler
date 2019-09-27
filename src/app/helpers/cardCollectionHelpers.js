import React from 'react'
import { connect } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../functions/credentials/client'

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials)
};

const cardCollections = firebase.firestore().collection("userCardCollections")

const addCardToUsersCollection = (user, card) => {
  const usersCardCollections = cardCollections.doc(user.uid)
  usersCardCollections.collection('cards').doc(card.id).set(card)
    .then(function() {
      console.log("Card successfully added!");
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
}

const deleteCardFromUsersCollection = (user, card) => {
  const usersCardCollections = cardCollections.doc(user.uid)
  usersCardCollections.collection('cards').doc(card.id).delete()
    .then(function() {
      console.log("Card successfully deleted!");
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
}

module.exports = {
  addCardToUsersCollection,
  deleteCardFromUsersCollection
}
