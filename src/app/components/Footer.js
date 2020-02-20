import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import Langs from '../helpers/languages'

import firebase from 'firebase/app'
import 'firebase/auth'
import Router from 'next/router'

const Footer = ({ dispatch, lang, user }) => {
  const router = useRouter()

  const handleLanguageSelectChange = (e) => {
    dispatch({ type: 'SET_ITEM', name: 'lang', payload: e.target.value });
    router.push(`/${e.target.value}`)
  }

  const LanguageSelect = () => {
    const renderOption = (option, i) => {
      return (
        <option key={i} value={option.lang}>{option.name}</option>
      )
    }
    return (
      <div>
        <label htmlFor="languageSelect">
          <div>Language:</div> 
          <select value={lang} onChange={handleLanguageSelectChange} id="languageSelect">
            {Langs.map((option, i) => renderOption(option, i))}
          </select>
        </label>
      </div>      
    )
  }

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

  return (
    <>
    <footer>
      <div className="container footer">
        <div className="footer-item">
          <LanguageSelect />
        </div>
        <div className="footer-item">
          item 1
        </div>
        <div className="footer-item">
          item 1
        </div>
        <div className="footer-item">
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a>About</a>
              </Link>
            </li>
            <li>
              <a href="https://github.com/BlakeGeist/next-firebase-boiler">GitHub</a>
            </li>

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
        </div>                        
      </div>
      <div className="container">
        <nav>
          <ul className="terms">
            <li>
              <Link href="/terms">
                <a>Terms</a>
              </Link>
            </li>
            <li>
              <Link href="privacy">
                <a>Privacy</a>
              </Link>            
            </li>
          </ul>
        </nav>
      </div>
    </footer>
    <style jsx>{`
      .footer {
        column-count: 4;
        background-color: #fff;
      }
      footer {
        text-align: center;
      }
      footer a {
        color: #067df7;
        -webkit-text-decoration: none;
        text-decoration: none;
        font-size: 13px;
      }
      ul.terms {
        display: flex;
        padding: 0;
        flex: 1 1 auto;
        justify-content: center;
      }
      ul.terms li {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        flex: 0 0 auto;
      }
      ul.terms li:after {
        content: " | ";
        padding: 0 5px;
      }
      ul.terms li:last-of-type:after{
        content: "";
      }
      nav {
        display: flex;
        justify-content: space-between;
      }
      .footer-item {
        min-height: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
      }         
    `}</style>
    </>
  )
};

export default connect(state => state)(Footer);
