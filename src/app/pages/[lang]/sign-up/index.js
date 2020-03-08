import React, { useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import clientCredentials from "../../../credentials/client";
import Layout from "../../../layouts/Layout";
import Router from "next/router";
import { compose, withState } from "recompose";
import AuthForm from "../../../components/AuthForm";
import LoadingSpinner from "../../../components/LoadingSpinner";

const SignUpBase = ({ setState, state, lang }) => {

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
        updateState("errorMessage", "");

        const {email, password} = state;
        const db = firebase.firestore();

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                const userDataCollection = db.collection("userData");
                await userDataCollection.doc(res.user.uid).set({})
                    .then(()=>{
                    })
                    .catch((e)=>{
                        res.json({ error: e });
                    });

            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if(errorCode === "auth/email-already-in-use"){
                    errorMessage = "email already in use, please sign in or use another email";
                }
                updateState("errorMessage", errorMessage);
            });
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };

    const onAuthStateChange = (user) => {
        if(user && user.uid){
            //Router.push(`/${lang}/dashboard`);
        }
    };

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged(onAuthStateChange);
        return () => unsubscribe();
    });

    return (
        <Layout pageMod="about">
            <div className="container">
                <h1>Sign Up page</h1>
                <p>Sign Up page content</p>
                <div className="login-form-wrapper">
                    <div className="login-form">
                        <AuthForm
                            errorMessage={errorMessage}
                            email={email}
                            password={password}
                            handleEmailPassAuth={handleEmailPassAuth}
                            handleChange={handleChange}
                        />
                        <button>Sign Up with Google</button>
                    </div>
                    <LoadingSpinner isLoading={isLoading} />
                </div>
            </div>
            <style jsx>{`
        .login-form-wrapper{
          display: flex;
          justify-content: center;
          padding: 50px;
        }
      `}</style>
        </Layout>
    );
};

const SignUp = compose(
    withState("state", "setState", {email: "", password: "", isLoading: false, errorMessage: ""})
)(SignUpBase);

export default SignUp;
