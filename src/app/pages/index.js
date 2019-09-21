import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';

const Index = () => {
  return (
    <Layout>
      <h1>Index page</h1>
      <p>Index page content</p>
    </Layout>
  )
}

export default connect(state => state)(Index);
