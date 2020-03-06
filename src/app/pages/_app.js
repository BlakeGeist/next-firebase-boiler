import React from "react";
import withReduxStore from "../lib/reducers";
import { Provider } from "react-redux";
import getStrings from '../helpers/getStrings'
import setUserState from '../helpers/setUserState'
import redirectIfNoLanguage from '../helpers/redirectIfNoLanguage'
import { ServerStyleSheet } from 'styled-components';

const MyApp = ({ Component, pageProps, reduxStore, styleTags }) => {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
      {styleTags}
    </Provider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  if (ctx.req){
    await redirectIfNoLanguage(ctx)
    await setUserState(ctx)
  }
  await getStrings(ctx)
  ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "lang", payload: ctx.query.lang });    
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  const sheet = new ServerStyleSheet();


    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();


  return { pageProps, styleTags };
};

export default withReduxStore(MyApp);
