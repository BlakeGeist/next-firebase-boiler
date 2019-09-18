import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux';
import firebase from 'firebase/app'
import 'firebase/auth'
import clientCredentials from '../credentials/client'

const leftNav = [
  { href: '/about', label: 'About' },
  { href: 'https://github.com/BlakeGeist/next-firebase-boiler', label: 'GitHub', isExternal: true }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link;
})

const userNav = [
  { href: '/sign-up', label: 'Sign Up' },
  { href: '/login', label: 'login' }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`
  return link
})

const Nav = ({ user, dispatch }) => {

  function LinkItem(props){
    if(props.isExternal){
      return <a href={props.href} className="navItem" target="_blank">{props.label}</a>
    } else {
      return <Link href={props.href}><a className="navItem">{props.label}</a></Link>
    }
  }

  const handleLogout = (e) => {
    e.preventDefault();
    if (!firebase.apps.length) {
      firebase.initializeApp(clientCredentials)
    };
    firebase.auth().signOut()
    //dispatch({ type: 'SET_ITEM', name: 'user', payload: null });
    fetch('/api/logout', {
      method: 'POST',
      credentials: 'same-origin'
    })
  };


  return (
    <>
    <nav>
      <ul>
        <li><Link href="/"><a className="navItem">Home</a></Link></li>
        {leftNav.map(({ key, href, label, isExternal }) => (
          <li key={key}>
            <LinkItem href={href} label={label} isExternal={isExternal} />
          </li>
        ))}
      </ul>
      <ul className="user-nav">
        <li><Link href="/sign-up"><a className="navItem">Sign Up</a></Link></li>
        <li>
          {user && user.email ? (
            <div>{user.email}: <button onClick={handleLogout}>Logout</button></div>
          ) : (
            <Link href="/login"><a className="navItem">Login</a></Link>
          )}
        </li>
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
        flex: 0 1 150px;
      }
      .user-nav li {
        display: flex;
        justify-content: flex-end;
      }
      li {
        display: flex;
        flex: 0 1 75px;
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
