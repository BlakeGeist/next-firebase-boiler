import React from "react";
import withReduxStore from "../lib/reducers";
import { Provider } from "react-redux";
import setUserState from "../helpers/_setUserState";
import redirectIfNoLanguage from "../helpers/redirectIfNoLanguage";
import getPageStrings from "../helpers/_getPageStrings";
import getGlobalStrings from "../helpers/_getGlobalStrings";
import Head from 'next/head'

const MyApp = ({ Component, pageProps, reduxStore }) => {
    return (
        <>
            <Provider store={reduxStore}>
                <Component {...pageProps} />
            </Provider>
        </>
    );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
    if (ctx.req){
        await redirectIfNoLanguage(ctx)
        await setUserState(ctx)
      }
      await getPageStrings(ctx)
      await getGlobalStrings(ctx)
      ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "lang", payload: ctx.query.lang });    
      const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
      return { pageProps };
};

export default withReduxStore(MyApp);
