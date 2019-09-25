import React, { useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../../functions/credentials/client'
import Layout from '../layouts/Layout';
import Router from 'next/router';
import { compose, withState } from 'recompose';
import AuthForm from '../components/AuthForm';
import LoadingSpinner from '../components/LoadingSpinner';
const axios = require('axios');

const LoginBase = ({ setState, state }) => {

  const { email, password, isLoading, errorMessage } = state;

  const handleChange = (event) => {
    let tempObj = {
      ...state
    }
    tempObj[event.target.name] = event.target.value;
    setState(tempObj)
  };

  function updateState(item, payload) {
    let tempObj = {
      ...state
    }
    tempObj[item] = payload;
    setState(tempObj)
  }

  const handleEmailPassAuth = (e) => {
    e.preventDefault();
    updateState('isLoading', true)
    const {email, password} = state;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      updateState('isLoading', false)
      if(errorCode === 'auth/user-not-found'){
        errorMessage = 'User not found please register'
      }
      updateState('errorMessage', errorMessage)
    });
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };

  const onAuthStateChange = (user) => {
    if(user && user.uid){
      Router.push('/dashboard')
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChange);
    return () => unsubscribe();
  });

  const handleEbayLogin = async () => {

    window.location ='https://auth.ebay.com/oauth2/authorize?client_id=BlakeGei-standard-PRD-ee6e394ea-800e1243&response_type=code&redirect_uri=Blake_Geist-BlakeGei-standa-oysusnr&scope=https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.marketing.readonly https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account.readonly https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly https://api.ebay.com/oauth/api_scope/sell.fulfillment https://api.ebay.com/oauth/api_scope/sell.analytics.readonly https://api.ebay.com/oauth/api_scope/sell.finances'

    return

    let apiCall = 'https://api.ebay.com/ws/api.dll'
    apiCall += '?X-EBAY-API-DEV-NAME=a036b866-4e0d-49de-b7f6-a45309064be2'
    apiCall += '&X-EBAY-API-CERT-NAME=PRD-bff3fe44f0ea-09ae-470f-9222-6e2c'
    apiCall += '&X-EBAY-API-APP-NAME=BlakeGei-standard-PRD-ee6e394ea-800e1243'
    apiCall += '&X-EBAY-API-CALL-NAME=GeteBayOfficialTime'
    apiCall += '&X-EBAY-API-SITEID=0'
    apiCall += '&X-EBAY-API-COMPATIBILITY-LEVEL=495'


    axios(apiCall)
      .then(res => {
        console.log(res)
      })
    //window.location ='https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&runame=Blake_Geist-BlakeGei-standa-oysusnr&SessID=<SESSION_ID>'
  }

  return (
    <Layout pageMod="about">
      <h1>Login page</h1>
      <p>Login page content</p>
      <div className="login-form-wrapper">
        <div className="login-form">
          <AuthForm
            errorMessage={errorMessage}
            email={email}
            password={password}
            handleEmailPassAuth={handleEmailPassAuth}
            handleChange={handleChange}
            />
          <div><button>Sign In with Google</button></div>
          <div><button onClick={handleEbayLogin}>Sign In With Ebay</button></div>
        </div>
        <LoadingSpinner isLoading={isLoading} />
      </div>
      <style jsx>{`
        .login-form-wrapper{
          display: flex;
          justify-content: center;
          padding: 50px;
          position: relative;
        }
      `}</style>
    </Layout>
  )
}

const Login = compose(
  withState('state', 'setState', {email: '', password: '', isLoading: false, errorMessage: ''})
)(LoginBase);

export default Login;
