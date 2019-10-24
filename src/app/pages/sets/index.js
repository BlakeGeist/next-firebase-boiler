import React, { useState } from 'react';
import Layout from '../../layouts/Layout';
import axios from 'axios';
import Link from 'next/link'
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../../functions/credentials/client'
import Pagination from '../../components/Pagination';

const Sets = ({ sets }) => {

  const totalPaginateditems = 557;

  const renderSet = (set, i) => {

    const handleImportSetClick = (e) => {
      e.preventDefault();
      axios({
        url: '/api/importCardsFromSet',
        params: {
          set: set.code
        }
      })
        .then(res => {
          console.log('successfully did a thing ', res)

        })
        .catch(err => {
          console.log('oh shit, you fucked up son')
        })
    }

    return (
      <tr key={i}>
        <th><img src={set.icon_svg_uri} width="24px" /></th>
        <td>
          <Link href="/s/[setId]" as={`/s/${set.code}`}><a>{set.name}</a></Link>
        </td>
        <td>{set.card_count}</td>
        <td><a href="" onClick={handleImportSetClick}>Import Link</a></td>
      </tr>
    )
  }

  const paginationData = {
    totalPaginateditems: totalPaginateditems,
    listingsPerPage: 25,
    data: sets
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
            <th>Import Link</th>
          </tr>
          {sets &&
            sets.map((set, i) => renderSet(set, i))
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

  const setsCollection = firebase.firestore().collection("sets").orderBy('index', 'asc').startAt(1).endAt(25)

  let sets;

  await setsCollection.get()
    .then((snap) =>{
      sets = snap.docs.map(d => d.data());
    })
    .catch((err) => {
      console.log(err)
    })

  return { sets }
}

export default Sets
