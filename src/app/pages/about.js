import React from 'react'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';

const About = () => {
  return (
    <>
      <Layout pageMod="about">
        <h1>About page</h1>
        <p>About page content</p>
      </Layout>
      <style jsx>{`
      `}</style>
    </>
  )

}
export default About
