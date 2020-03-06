import React, { useEffect } from 'react';
import Link from 'next/link'
import { connect } from 'react-redux';
import firebase from 'firebase/app'
import 'firebase/auth'
import Router from 'next/router';
import { translate } from '../helpers/quickHelpers';
import cookie from 'js-cookie'

const Nav = ({ user, dispatch, lang, strings }) => {
  
  const leftNav = [
    { href: `/${lang}`, label: translate('HOME', strings, lang), target: '/' },
    { href: `/${lang}/about`, label: translate('ABOUT-US', strings, lang), target: '/about' },
    { href: `/${lang}/contact`, label: translate('CONTACT', strings, lang), target: '/contact' },
    { href: `/${lang}/p`, label: translate('SHOP', strings, lang), target: '/p' },
    { href: `/${lang}/blog`, label: translate('BLOG', strings, lang), target: '/blog' },
    { href: 'https://github.com/BlakeGeist/next-firebase-boiler', label: 'GitHub', isExternal: true }
  ].map(link => {
    link.key = `nav-link-${link.href}-${link.label}`
    return link;
  });

  const userNav = [
    { href: `/${lang}/sign-up`, label: translate('SIGN-UP', strings, lang), target: '/sign-up' },
    { href: `/${lang}/login`, label: translate('LOGIN', strings, lang), target: 'login' }
  ].map(link => {
    link.key = `nav-link-${link.href}-${link.label}`
    return link
  });

  const handleLogout = (e) => {
    e.preventDefault();
    firebase.auth().signOut()
      .then(()=>{
        dispatch({ type: 'SET_ITEM', name: 'user', payload: {} });
        dispatch({ type: "SET_ITEM", name: "isLoggedIn", payload: false });
        cookie.remove('token2')
        Router.push(`/${lang}/login`)
      })
  }

  const LinkItem = ({ isExternal, href, label, target }) => {
    if(isExternal){
      return <a href={`/[lang]${target}`} as={href} className="navItem" target="_blank">{label}</a>
    } else {
      return <Link href={href}><a className="navItem">{label}</a></Link>
    }
  }

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
              <Link href={`/${lang}/dashboard`}><a className="navItem">{translate('DASHBOARD', strings, lang)}</a></Link>
            </li>
            <li>
              <a href="" className="navItem" onClick={handleLogout}>{translate('LOGOUT', strings, lang)}</a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href={`/${lang}/sign-up`}><a className="navItem">{translate('SIGN-UP', strings, lang)}</a></Link>
            </li>
            <li>
              <Link href={`/${lang}/login`}><a className="navItem">{translate('LOGIN', strings, lang)}</a></Link>
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
