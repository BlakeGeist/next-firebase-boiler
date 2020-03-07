import React from "react";
import { connect } from "react-redux";
import Layout from "../../layouts/Layout";
import Carousel from '../../components/Carousel'

const Index = ({ lang }) => {
  return (
    <Layout pageMod='index'>
      <Carousel />
      <h1>{lang} Home Page</h1>
    </Layout>
  );
};

export default connect(state => state)(Index);
