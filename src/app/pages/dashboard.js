import React, { useState } from 'react';
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../functions/credentials/client'
import Router from 'next/router';
import Link from 'next/link'
import  _ from 'lodash';
import axios from 'axios';
import { compose, withState } from 'recompose';
import Modal from '../components/Modal';

const qs = require('qs');

const Dashbaord = ({ user, modalIsOpen, dispatch }) => {

  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
     
     {user.email}

      <style global jsx>{`
        .cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </Layout>
  )
}

Dashbaord.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const { user } = reduxStore.getState();
  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };
  const isServer = !!req

  return { user };
}

export default connect(state => state)(Dashbaord);
