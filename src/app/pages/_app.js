import App from 'next/app'
import React from 'react'
import withReduxStore from '../lib/reducers'
import { Provider } from 'react-redux'

class MyApp extends App {
  render () {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <Component {...pageProps} />
        <style jsx global>{`
        `}</style>
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
