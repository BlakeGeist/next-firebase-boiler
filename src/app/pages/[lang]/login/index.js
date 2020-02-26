import React, { useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import clientCredentials from "../../..//credentials/client";
import Layout from "../../../layouts/Layout";
import Router from "next/router";
import { compose, withState } from "recompose";
import AuthForm from "../../../components/AuthForm";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { connect } from "react-redux";

const LoginBase = ({ setState, state, dispatch, lang }) => {

  if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials);
  };

  const { email, password, isLoading, errorMessage } = state;

  const handleChange = (event) => {
    let tempObj = {
      ...state
    };
    tempObj[event.target.name] = event.target.value;
    setState(tempObj);
  };

  function updateState(item, payload) {
    let tempObj = {
      ...state
    };
    tempObj[item] = payload;
    setState(tempObj);
  }

  const handleEmailPassAuth = (e) => {
    e.preventDefault();
    updateState("isLoading", true);
    const {email, password} = state;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      updateState("isLoading", false);
      if(errorCode === "auth/user-not-found"){
        errorMessage = "User not found please register";
      }
      updateState("errorMessage", errorMessage);
    });
  };

  const onAuthStateChange = async (user) => {
    if(user && user.uid){
      dispatch({ type: "SET_ITEM", name: "user", payload: user });
      dispatch({ type: "SET_ITEM", name: "isLoggedIn", payload: true });
      Router.push(`/${lang}/dashboard`);
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
            errorMessage={errorMessage}
            email={email}
            password={password}
            handleEmailPassAuth={handleEmailPassAuth}
            handleChange={handleChange}
            />
          <div><button>Sign In with Google</button></div>
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
  );
};

const Login = compose(
  withState("state", "setState", {email: "", password: "", isLoading: false, errorMessage: ""})
)(LoginBase);

export default connect(state => state)(Login);
