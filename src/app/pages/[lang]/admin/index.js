import React from "react";
import { connect } from "react-redux";
import Layout from "../../../layouts/Layout";

const Admin = ({ user }) => {
    return (
        <Layout>
            <div className="container">
                <h1>Admin page</h1>
            </div>
        </Layout>
    );
};

Admin.getInitialProps = async ({ reduxStore, res }) => {
    const state = reduxStore.getState();
};
  
export default connect(state => state)(Admin);
  