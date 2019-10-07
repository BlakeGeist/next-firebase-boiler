import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link'
import { connect } from 'react-redux';


const Set = ({set, state, setState, dispatch }) => {
  [state, setState] = useState({set})

  const handleImportSetClick = (e) => {
    e.preventDefault();
    dispatch({ type: 'SET_ITEM', name: 'isLoading', payload: true });
    axios({
      url: '/api/importCardsFromSet',
      params: {
        set: set.code
      }
    })
      .then(res => {
        dispatch({ type: 'SET_ITEM', name: 'isLoading', payload: false });
        console.log('successfully did a thing ', res)
        let tempSet = set;
        tempSet.hasCards = true;
        setState(tempSet)
      })
      .catch(err => {
        dispatch({ type: 'SET_ITEM', name: 'isLoading', payload: false });
        console.log('oh shit, you fucked up son')
      })
  }

  return (
    <tr>
      <th><img src={set.icon_svg_uri} width="24px" /></th>
      <td>
        <Link href="/s/[setId]" as={`/s/${set.code}`}><a>{set.name}</a></Link>
      </td>
      <td>{set.card_count}</td>
      {!set.hasCards &&
        <td><a href="" onClick={handleImportSetClick}>Import Link</a></td>
      }
    </tr>
  )
}

export default connect(state => state)(Set);
