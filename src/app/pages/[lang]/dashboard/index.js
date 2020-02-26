import React from "react";
import { connect } from "react-redux";
import Layout from "../../../layouts/Layout";
import { translate } from "../../../helpers/quickHelpers";
import Link from "next/link";

const qs = require("qs");

const Dashbaord = ({ user, modalIsOpen, dispatch, strings, lang, pageStrings }) => {
  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
      
      <nav>
        <Link href={`/${lang}/dashboard/strings`}>
          <a>{translate("MANAGE-STRINGS", pageStrings, lang)}</a>
        </Link>
      </nav>

      <style global jsx>{`
        .cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </Layout>
  );
};

Dashbaord.getInitialProps = async ({ reduxStore, req, query, res }) => {
  const state = reduxStore.getState();
  if(!state.isLoggedIn) res.redirect(`/${state.lang}`);
};

export default connect(state => state)(Dashbaord);
