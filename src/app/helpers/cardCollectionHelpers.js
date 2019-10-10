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

const getUsersCardCollection = async (user) => {
  const usersCardCollectionData = cardCollections.doc(user.uid)
  let usersCardCollectionDataIds;
  await usersCardCollectionData.collection('cards').get()
    .then((snap) =>{
      usersCardCollectionDataIds = snap.docs.map(d => d.data());
    })
    .catch((err) => {
      console.log(err)
    })

  const usersCardCollctionIds = usersCardCollectionDataIds.map(d => d.id);

  let usersCardCollection = [];

  let proms = [];

  const cardCollectionFirebase = firebase.firestore().collection('cards');
  usersCardCollctionIds.forEach(cardId => {
    proms.push(
    cardCollectionFirebase.doc(cardId).get()
      .then(doc => {
        usersCardCollection.push(doc.data())
      })
      .catch(err => console.log(err))
    )
  })

  await Promise.all(proms)

  let cardCollection = [];

  if(usersCardCollection){
    for(let i=0; i<usersCardCollection.length; i++) {
      cardCollection.push({
       ...usersCardCollection[i],
       ...(usersCardCollectionDataIds.find((itmInner) => itmInner.id === usersCardCollection[i].id))}
      );
    }
  }

  return usersCardCollection;
}

module.exports = {
  addCardToUsersCollection,
  deleteCardFromUsersCollection,
  getUsersCardCollection
}
