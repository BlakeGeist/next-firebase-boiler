import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const Layout = ({ children, pageMod }) => {
    const containerClass = ((pageMod) ? "container " + pageMod + "-page" : "container");

    return (
        <>
            <Header />
            <main className="body">
                <div className={containerClass}>
                    <div>{ children }</div>
                </div>
            </main>
            <Footer />
            <LoadingSpinner />
            <Modal />
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
              .container .container {
                padding: 0 24px;
              }
              h1 {
                margin: 0;
                padding: 2rem 0 1rem;            
              }
          `}</style>
        </>
    );
};

export default connect(state => state)(Layout);
