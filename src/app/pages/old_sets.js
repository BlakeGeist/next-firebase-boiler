import React from 'react'
import Layout from '../layouts/Layout';
import axios from 'axios';
import Link from 'next/link'
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../functions/credentials/client'
import Pagination from '../components/Pagination';

const Sets = ({ sets }) => {

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
    listingsPerPage: 10,
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

  const { user } = reduxStore.getState();

  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };

  const setsCollection = firebase.firestore().collection("sets").orderBy('released_at', 'desc')

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
