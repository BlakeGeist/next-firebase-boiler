import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import Langs from "../helpers/languages";
import _ from "lodash";
import NewsLetterFormOr from "./NewsLetterFormOr";
import firebase from "firebase/app";
import "firebase/auth";
import Router from "next/router";
import { translate } from "../helpers/quickHelpers";

const Footer = ({ dispatch, lang, user, strings }) => {
    const router = useRouter();

    const handleLanguageSelectChange = (e) => {
        router.push(Router.pathname, Router.asPath.split(`/${lang}/`).join(`/${e.target.value}/`), { shallow: true });
        return dispatch({ type: "SET_ITEM", name: "lang", payload: e.target.value });
    };

    const LanguageSelect = () => {
        const renderOption = (option, i) => {
            return (
                <option key={i} value={option.lang}>{option.name}</option>
            );
        };
        return (
            <div>
                <label htmlFor="languageSelect">
                    <div>{translate("LANGUAGE", strings, lang)}:</div> 
                    <select value={lang} onChange={handleLanguageSelectChange} id="languageSelect">
                        {Langs.map((option, i) => renderOption(option, i))}
                    </select>
                </label>
            </div>      
        );
    };

    const handleLogout = (e) => {
        e.preventDefault();
        firebase.auth().signOut()
            .then(()=>{
                dispatch({ type: "SET_ITEM", name: "user", payload: {} });
                Router.push("/login");
            });
    };

    return (
        <>
            <footer>
                <div className="container footer">
                    <div className="footer-item">
                        <LanguageSelect />
                    </div>
                    <div className="footer-item">
                        <NewsLetterFormOr>
                            You are already subbscribed to our newsletter!
                        </NewsLetterFormOr>
                    </div>
                    <div className="footer-item">
                        item 1
                    </div>
                    <div className="footer-item">
                        <ul>
                            <li>
                                <Link href='/[lang]' as={`/${lang}`}>
                                    <a>{translate("HOME", strings, lang)}</a>
                                </Link>
                            </li>
                            <li>
                                <Link href='/[lang]/about' as={`/${lang}/about`}>
                                    <a>{translate("ABOUT-US", strings, lang)}</a>
                                </Link>
                            </li>
                            <li>
                                <a href="https://github.com/BlakeGeist/next-firebase-boiler" target="_blank">GitHub</a>
                            </li>

                            {user && user.uid ? (
                                <>
                                    <li>
                                        <Link href='/[lang]/dashboard' as={`/${lang}/dashboard`}>
                                            <a className="navItem">{translate("DASHBOARD", strings, lang)}</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="" className="navItem" onClick={handleLogout}>{translate("LOGOUT", strings, lang)}</a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link href='/[lang]/sign-up' as={`/${lang}/sign-up`}>
                                            <a className="navItem">{translate("SIGN-UP", strings, lang)}</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href='/[lang]/login' as={`/${lang}/login`}>
                                            <a className="navItem">{translate("LOGIN", strings, lang)}</a>
                                        </Link>
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
                                <Link href='/[lang]/terms' as={`/${lang}/terms`}>
                                    <a>{translate("TERMS", strings, lang)}</a>
                                </Link>
                            </li>
                            <li>
                                <Link href='/[lang]/privacy' as={`/${lang}/privacy`}>
                                    <a>{translate("PRIVACY", strings, lang)}</a>
                                </Link>            
                            </li>
                        </ul>
                    </nav>
                </div>
            </footer>
            <style global jsx>{`
      .footer {
        column-count: 4;
        background-color: #fff;
        border-top: 3px solid #ccc;
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
      .footer-item label {
        display: flex;
      }
      .footer-item label select {
        margin: 0 5px;
      }
    `}</style>
        </>
    );
};

export default connect(state => state)(Footer);
