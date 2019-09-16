import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Layout = ({ children, pageMod }) => {
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
          .container {
            max-width: 1150px;
            margin: 0 auto;
          }
      `}</style>
    </>
  )
}

export default Layout;
