import React, { useEffect } from 'react';
import Link from 'next/link'
import { connect } from 'react-redux';
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../../functions/credentials/client'
import Router from 'next/router';

const Nav = ({ user, dispatch }) => {

  const leftNav = [
    { href: '/', label: 'Home' },
    { href: '/sets', label: 'Sets'},
    { href: '/about', label: 'About' },
    { href: 'https://github.com/BlakeGeist/next-firebase-boiler', label: 'GitHub', isExternal: true }
  ].map(link => {
    link.key = `nav-link-${link.href}-${link.label}`
    return link;
  });

  const userNav = [
    { href: '/sign-up', label: 'Sign Up' },
    { href: '/login', label: 'login' }
  ].map(link => {
    link.key = `nav-link-${link.href}-${link.label}`
    return link
  });

  const handleLogout = (e) => {
    e.preventDefault();
    firebase.auth().signOut()
    .then(()=>{
      dispatch({ type: 'SET_ITEM', name: 'user', payload: {} });
      Router.push('/login')
    })
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'same-origin'
    })
  }

  const LinkItem = ({ isExternal, href, label }) => {
    if(isExternal){
      return <a href={href} className="navItem" target="_blank">{label}</a>
    } else {
      return <Link href={href}><a className="navItem">{label}</a></Link>
    }
  }

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };

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
      } else {
        // eslint-disable-next-line no-undef
        fetch('/api/logout', {
          method: 'POST',
          credentials: 'same-origin'
        })
      }
    })
  });

  return (
    <>
    <nav>
      <ul>
        {leftNav.map(({ key, href, label, isExternal }) => (
          <li key={key}>
            <LinkItem href={href} label={label} isExternal={isExternal} />
          </li>
        ))}
      </ul>
      <ul className="user-nav">
        {user && user.uid ? (
          <>
            <li>
              <Link href="/dashboard"><a className="navItem">Dashboard</a></Link>
            </li>
            <li>
              <a href="" className="navItem" onClick={handleLogout}>Logout</a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/sign-up"><a className="navItem">Sign Up</a></Link>
            </li>
            <li>
              <Link href="/login"><a className="navItem">Login</a></Link>
            </li>
          </>
        )}
      </ul>
    </nav>
    <style global jsx>{`
      .navItem {
        color: #067df7;
        text-decoration: none;
        font-size: 13px;
      }
    `}</style>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }
      ul {
        display: flex;
        padding: 0;
        flex: 1 1 auto;
      }
      .user-nav{
        flex: 0 1 auto;
      }
      li {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        flex: 0 0 auto;
      }
      li:after {
        content: " | ";
        padding: 0 5px;
      }
      li:last-of-type:after{
        content: "";
      }
      nav {
        display: flex;
        justify-content: space-between;
      }
    `}</style>
    </>
  )

}

export default connect(state => state)(Nav);
