import React, { useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../../functions/credentials/client'
import Layout from '../layouts/Layout';
import Router from 'next/router';
import { compose, withState } from 'recompose';
import AuthForm from '../components/AuthForm';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginBase = ({ setState, state }) => {

  const { email, password, isLoading } = state;

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
    });
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials)
  };

  const onAuthStateChange = (user) => {
    if(user && user.email){
      Router.push('/dashboard')
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChange);
    return () => unsubscribe();
  });

  return (
    <Layout pageMod="about">
      <h1>Login page</h1>
      <p>Login page content</p>
      <div className="login-form-wrapper">
        <div className="login-form">
          <AuthForm
            email={email}
            password={password}
            handleEmailPassAuth={handleEmailPassAuth}
            handleChange={handleChange}
            />
          <button>Sign Up with Google</button>
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
  withState('state', 'setState', {email: '', password: '', isLoading: false})
)(LoginBase);

export default Login;
