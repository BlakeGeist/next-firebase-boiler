import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import '../App.css';

class Index extends React.Component {
  static async getInitialProps ({ reduxStore, req }) {
    const isServer = !!req
    return {isServer}
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  render () {
    return (
      <Layout>
        <h1>Index page</h1>
        <p>Index page content</p>
      </Layout>
      )
  }
}
const mapDispatchToProps = {  }
export default connect(
  null,
  mapDispatchToProps
)(Index)
