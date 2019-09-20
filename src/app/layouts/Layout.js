import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { connect } from 'react-redux'
import Router from 'next/router';

const Layout = ({ children, pageMod, isAuthedRequired }) => {
  let containerClass = 'container';
  if(pageMod){
    containerClass += ' mod-' + pageMod + '-page';
  }

  return (
    <>
      <Header />
      <main className="body">
        <div className={containerClass}>
          { children }
        </div>
      </main>
      <Footer />
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
