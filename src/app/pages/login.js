import React, { Component } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import clientCredentials from '../credentials/client'
import Layout from '../layouts/Layout';
import { connect } from 'react-redux';
import Messages from '../components/Messages';
import Router from 'next/router';

class Login extends Component {
  static async getInitialProps({ reduxStore, req, query }) {
    const isServer = !!req
    return { isServer };
  }

  _isMounted = false;
  constructor (props) {
    super(props)
    this.state = {

    }
    this.addDbListener = this.addDbListener.bind(this)
    this.removeDbListener = this.removeDbListener.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRemoveMessage = this.handleRemoveMessage.bind(this)
  }

  componentDidMount () {
    const {dispatch} = this.props
    this._isMounted = true;
    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };

    if (this.props.user) this.addDbListener()

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        return user
          .getIdToken()
          .then(token => {
            dispatch({ type: 'SET_ITEM', name: 'user', payload: user });
            // eslint-disable-next-line no-undef
            return fetch('/api/login', {
              method: 'POST',
              // eslint-disable-next-line no-undef
              headers: new Headers({ 'Content-Type': 'application/json' }),
              credentials: 'same-origin',
              body: JSON.stringify({ token })
            })
          })
          .then(res => {
            var db = firebase.firestore()
            let unsubscribe = db.collection('messages').onSnapshot(
              querySnapshot => {
                var messages = {}
                querySnapshot.forEach(function (doc) {
                  messages[doc.id] = doc.data()
                })
                //if (messages && this._isMounted) dispatch({ type: 'SET_ITEM', name: 'messages', payload: messages });
              },
              error => {
                console.error(error)
              }
            )
            this.setState({ unsubscribe })
            //Router.push({
              //pathname: '/dashboard'
            //})
          })
      } else {
        dispatch({ type: 'SET_ITEM', name: 'user', payload: null });
        // eslint-disable-next-line no-undef
        fetch('/api/logout', {
          method: 'POST',
          credentials: 'same-origin'
        }).then(() => this.removeDbListener())

      }
    })
  }

  componentWillUnmount() {
     this._isMounted = false;
   }

   addDbListener () {

   }

  removeDbListener () {
    // firebase.database().ref('messages').off()
    if (this.state.unsubscribe) {
      this.state.unsubscribe()
    }
  }

  handleChange (event) {
    this.setState({ value: event.target.value })
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
    this.setState({ value: '' })
  }

  handleLogin () {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  handleLogout () {
    firebase.auth().signOut()
  }

  handleRemoveMessage (event) {
    var db = firebase.firestore();
    db.collection('messages').doc(event.target.value.toString()).delete()
  }

  render () {
    const { user, value, messages } = this.props;
    return (
      <Layout>
        {user && user.email ? (
          <div>
            {user.email}
            <button onClick={this.handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={this.handleLogin}>Sign Up with Google</button>
        )}
        {user && user.email && (
          <div>
            <form onSubmit={this.handleSubmit}>
              <input
                type={'text'}
                onChange={this.handleChange}
                placeholder={'add message...'}
                value={value}
                required
              />
            <input
                type={'submit'}
              />
            </form>
            <Messages />
          </div>
        )}
      </Layout>
    )
  }
}

export default connect(state => state)(Login);
