import React from 'react'
import Layout from '../layouts/Layout';
import axios from 'axios';
import Link from 'next/link'

const Sets = ({ sets }) => {

  const renderSet = (set, i) => {
    return (
      <tr key={i}>
        <th><img src={set.icon_svg_uri} width="24px" /></th>
        <td>
          <Link href="/s/[setId]" as={`/s/${set.code}`}><a>{set.name}</a></Link>
        </td>
        <td>{set.card_count}</td>
      </tr>
    )
  }

  return (
    <Layout pageMod="sets">
      <h1>Sets page</h1>
      <p>Set page content</p>
      <table>
        <tbody>
          <tr>
            <th>Icon</th>
            <th>Set Name</th>
            <th>Card Count</th>
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
  let response = await axios.get('https://api.scryfall.com/sets');
  const sets = response.data.data;
  return { sets }
}

export default Sets
