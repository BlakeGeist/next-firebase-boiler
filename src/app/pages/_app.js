import React from "react";
import withReduxStore from "../lib/reducers";
import { Provider } from "react-redux";
import getStrings from '../helpers/getStrings'
import setUserState from '../helpers/setUserState'
import redirectIfNoLanguage from '../helpers/redirectIfNoLanguage'

const MyApp = ({ Component, pageProps, reduxStore }) => {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  await redirectIfNoLanguage(ctx)
  await getStrings(ctx)
  await setUserState(ctx)
  ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "lang", payload: ctx.query.lang });
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return { pageProps };
};

export default withReduxStore(MyApp);
