import React, { useState } from 'react';
import Layout from '../../../layouts/Layout';
import axios from 'axios';
import Link from 'next/link'
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../../../functions/credentials/client'
import Pagination from '../../../components/Pagination';
import Set from './set';

const Sets = ({ sets, pageNumber }) => {

  const totalPaginateditems = 557;

  const paginationData = {
    totalPaginateditems: totalPaginateditems,
    listingsPerPage: 25,
    data: sets,
    activePageNumber: pageNumber
  }

  return (
    <Layout pageMod="sets">
      <h1>Sets page</h1>
      <p>Set page content</p>
      <table>
        <tbody>
          <tr>
            <td><Pagination pagination={paginationData} /></td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <th>Icon</th>
            <th>Set Name</th>
            <th>Card Count</th>
          </tr>
          {sets &&
            sets.map((set, i) => <Set set={set} key={i} />)
          }
        </tbody>
      </table>
    </Layout>
  )
}

Sets.getInitialProps = async ({ reduxStore, req, query, res }) => {

  var pageNumber = parseInt(query.page);

  const { user } = reduxStore.getState();

  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };

  const paginationCount = 25;

  let startAt, endAt;
  if (pageNumber === 1){
    startAt = 1
    endAt = paginationCount
  } else {
    startAt = (pageNumber - 1) * paginationCount + 1
    endAt = pageNumber * paginationCount
  }

  const setsCollection = firebase.firestore().collection("sets").orderBy('index', 'asc').startAt(startAt).endAt(endAt)

  let sets;

  await setsCollection.get()
    .then((snap) =>{
      sets = snap.docs.map(d => d.data());
    })
    .catch((err) => {
      console.log(err)
    })

  return { sets, pageNumber }
}

export default Sets
