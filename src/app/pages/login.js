import React, { Component } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import clientCredentials from '../credentials/client'
import Layout from '../layouts/Layout';
import { connect } from 'react-redux';
import Router from 'next/router';

class Login extends Component {
  static async getInitialProps({ reduxStore, req, query }) {
    const isServer = !!req
    return { isServer };
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      value: ''
    }
    this.handleEmailPassAuth = this.handleEmailPassAuth.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRemoveMessage = this.handleRemoveMessage.bind(this)
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

  handleSubmit (event) {
    event.preventDefault()
    var db = firebase.firestore()
    const date = new Date().getTime()
    db.collection('messages')
      .doc(`${date}`)
      .set({
        id: date,
        text: this.state.value
      })
      //safe
  }

  handleLogin () {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  handleRemoveMessage (event) {
    var db = firebase.firestore();
    db.collection('messages').doc(event.target.value.toString()).delete()
  }

  handleEmailPassAuth (e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }

  render () {
    const { user, value, messages } = this.props;
    return (
      <Layout>
        <div className="login-form-wrapper">
          <div className="login-form">

            <form onSubmit={this.handleEmailPassAuth}>
              <div><input type="email" placeholder="Email" value={this.state.email} name="email" onChange={this.handleChange} required /></div>
              <div><input type="password" placeholder="Password" value={this.state.password} name="password" onChange={this.handleChange} required /></div>
              <div><input type="submit" /></div>
            </form>

            <button onClick={this.handleLogin}>Login Up with Google</button>
            {user && user.email && (
              <div>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type={'text'}
                    onChange={this.handleChange}
                    placeholder={'add message...'}
                    value={value}
                    required
                    name="value"
                  />
                <input
                    type={'submit'}
                  />
                </form>
              </div>
            )}
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
    )
  }
}

export default connect(state => state)(Login);
