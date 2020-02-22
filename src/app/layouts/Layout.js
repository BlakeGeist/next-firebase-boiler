import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { connect } from 'react-redux'
import Router from 'next/router';
import css from '../App.css';
import LoadingSpinner from '../components/LoadingSpinner';

const Layout = ({ children, pageMod, isAuthedRequired }) => {
  const containerClass = ((pageMod) ? 'container ' + pageMod + '-page' : 'container');

  return (
    <>
      <Header />
      <main className="body">
        <div className={containerClass}>
          <div style={{padding: '10px'}}>
            { children }
          </div>
        </div>
      </main>
      <Footer />
      <LoadingSpinner />
      <style global jsx>{`
          html, body, #__next {
            height: 100%;
          }
          #__next{
            display: flex;
            flex-direction: column;
          }
          body{
            background-color: #f1f1f1;
          }
          main {
            flex: 1 1 100%;
          }
          main .container {
            height: 100%;
            background-color: #fff;
            min-height: 500px;
          }
          .container {
            max-width: 1150px;
            margin: 0 auto;
          }
      `}</style>
    </>
  )
}

export default connect(state => state)(Layout);
