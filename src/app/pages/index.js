import React from "react";
import { connect } from "react-redux";
import Layout from "../layouts/Layout";
import axios from "axios";

const Index = ({ card }) => {
  return (
    <Layout pageMod='index'>
        Home PAge
    </Layout>
  );
};

Index.getInitialProps = async ({ reduxStore, req, query, res }) => {
 

};

export default connect(state => state)(Index);
