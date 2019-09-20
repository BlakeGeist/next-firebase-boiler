import App, {Container} from "next/app";
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'

const MyApp = ({ Component, pageProps, reduxStore }) => {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  )
}

MyApp.getInitialProps = async ({Component, ctx}) => {
  const user = ctx.req && ctx.req.session ? ctx.req.session.decodedToken : null;
  (user) ? ctx.reduxStore.dispatch({ type: 'SET_ITEM', name: 'user', payload: user }) : '';
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
  return {pageProps};
}

export default withReduxStore(MyApp)
