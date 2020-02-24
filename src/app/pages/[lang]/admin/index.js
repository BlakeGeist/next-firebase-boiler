import React from 'react'
import { connect } from 'react-redux'
import Layout from '../../../layouts/Layout'

const Admin = ({ user }) => {
    console.log(user)
    return (
        <Layout>
            <h1>Admin page</h1>
        </Layout>
    )
}

Admin.getInitialProps = async ({ reduxStore, res }) => {
    const state = reduxStore.getState()
  }
  
export default connect(state => state)(Admin);
  