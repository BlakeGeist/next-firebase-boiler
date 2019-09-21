import React from 'react'
import Layout from '../../../layouts/Layout';
import { useRouter } from 'next/router'
import axios from 'axios';

const Index = ({ set }) => {

  const setKeys = Object.keys(set)

  const renderSetKeyAndValue = (key, i) => {
    return (
      <tr key={i}>
        <td>{key}</td>
        <td>{set[key].toString()}</td>
      </tr>
    )
  };

  return (
    <Layout pageMod="set">
      <div>
        <div>
          <h2>{set.name}</h2>
          <table>
            <tbody>
              {setKeys &&
                setKeys.map((key, i) => renderSetKeyAndValue(key, i))
              }
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const { setId } = query;
  let response = await axios.get('https://api.scryfall.com/sets/'+setId);
  const set = response.data;
  console.log(set)
  return { set }
};

export default Index
