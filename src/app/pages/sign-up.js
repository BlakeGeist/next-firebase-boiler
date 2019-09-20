import React, { Component } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import clientCredentials from '../credentials/client'
import { connect } from 'react-redux'
import Layout from '../layouts/Layout';
import Router from 'next/router';

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      value: ''
    }
    this.handleEmailPassAuth = this.handleEmailPassAuth.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleGAuth = this.handleGAuth.bind(this)
  }
  componentDidMount () {
    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Router.push('/dashboard')
      }
    })
  }
  handleChange (event) {
    let tempOb = {};
    tempOb[event.target.name] = event.target.value
    this.setState({ ...tempOb, tempOb })
  }

  handleEmailPassAuth (e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  handleGAuth () {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  render () {
    return (
      <>
        <Layout pageMod="about">
          <h1>SignUp page</h1>
          <p>SignUp page content</p>
          <div className="login-form-wrapper">
            <div className="login-form">
              <form onSubmit={this.handleEmailPassAuth}>
                <div><input type="email" placeholder="Email" value={this.state.email} name="email" onChange={this.handleChange} required /></div>
                <div><input type="password" placeholder="Password" value={this.state.password} name="password" onChange={this.handleChange} required /></div>
                <div><input type="submit" /></div>
              </form>
              <button onClick={this.handleGAuth}>Sign Up with Google</button>
            </div>
          </div>
        </Layout>
        <style jsx>{`
            .login-form-wrapper{
              display: flex;
              justify-content: center;
              padding: 50px;
            }
        `}</style>
      </>
    )
  }
}
export default SignUp
