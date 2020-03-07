import React from 'react';
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";;
import clientCredentials from "../../../credentials/client";
import Layout from "../../../layouts/Layout";

const Product = ({ product }) => {
    return (
        <Layout>
            <div className="container">
                <h1>{product.name}</h1>
            </div>
        </Layout>
    )
}

Product.getInitialProps = async ({ query  }) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };
    const db = firebase.app().firestore();
    const productsCollection = db.collection("products").doc(query.slug)
    const productsResponse = await productsCollection.get()
    const product = productsResponse.data();

    return { product }
}

export default connect(state => state)(Product);
