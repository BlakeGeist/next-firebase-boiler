import React from "react";
import { connect } from "react-redux";
import Layout from "../../layouts/Layout";

const Index = ({ lang }) => {
  return (
    <Layout pageMod='index'>
       <h1>{lang} Home Page</h1>
    </Layout>
  );
};

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
};

export default connect(state => state)(Index);
