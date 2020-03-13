import React, { useEffect } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import Router from "next/router";
import { translate } from "../helpers/quickHelpers";
import cookie from "js-cookie";
import clientCredentials from "../credentials/client";
import LoginModal from './ModalLogin'
import { withRouter } from 'next/router';

const Nav = ({ router, user, dispatch, lang, strings }) => {
  
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };

    const leftNav = [
        { href: `/${lang}`, label: translate("HOME", strings, lang), target: "/" },
        { href: `/${lang}/about`, label: translate("ABOUT-US", strings, lang), target: "/about" },
        { href: `/${lang}/contact`, label: translate("CONTACT", strings, lang), target: "/contact" },
        { href: `/${lang}/p`, label: translate("SHOP", strings, lang), target: "/p" },
        { href: `/${lang}/blog`, label: translate("BLOG", strings, lang), target: "/blog" },
        { href: "https://github.com/BlakeGeist/next-firebase-boiler", label: "GitHub", isExternal: true }
    ].map(link => {
        link.key = `nav-link-${link.href}-${link.label}`;
        return link;
    });

    const handleLogout = (e) => {
        e.preventDefault();
        firebase.auth().signOut()
            .then(()=>{
                dispatch({ type: "SET_ITEM", name: "user", payload: {} });
                dispatch({ type: "SET_ITEM", name: "isLoggedIn", payload: false });
                cookie.remove("token2");
                if(router) {
                    Router.push(router.pathname);
                }
            });
    };
    const handleOpenModal = (e) => {
        e.preventDefault();
        dispatch({ type: "SET_ITEM", name: "modalTarget", payload: <LoginModal /> });
    }
    const LinkItem = ({ isExternal, href, label, target }) => {
        if(isExternal){
            return <a href={href} className="navItem" target="_blank">{label}</a>;
        } else {
            return (
                <Link href={`/[lang]${target}`} as={href}>
                    <a className="navItem">{label}</a>
                </Link>
            );
        }
    };

    return (
        <>
            <nav>
                <ul>
                    {leftNav.map(({ key, href, label, isExternal, target }) => (
                        <li key={key}>
                            <LinkItem href={href} label={label} isExternal={isExternal} target={target} />
                        </li>
                    ))}
                </ul>
                <ul className="user-nav">
                    {user && user.uid ? (
                        <>
                            <li>
                                <Link href="/[lang]/dashboard" as={`/${lang}/dashboard`}><a className="navItem">{translate("DASHBOARD", strings, lang)}</a></Link>
                            </li>
                            <li>
                                <a href="" className="navItem" onClick={handleLogout}>{translate("LOGOUT", strings, lang)}</a>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link href='/[lang]/sign-up' as={`/${lang}/sign-up`}><a className="navItem">{translate("SIGN-UP", strings, lang)}</a></Link>
                            </li>
                            <li>
                                <a onClick={e => handleOpenModal(e)} className="navItem" href={"/[lang]/login"} as={`/${lang}/login`}>
                                    Login
                                </a>
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
    );

};

export default connect(state => state)(Nav);
