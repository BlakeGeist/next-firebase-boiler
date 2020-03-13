import React from "react";
import Layout from "../../../layouts/Layout";
import AddProductForm from './components/AddProductFrom';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import clientCredentials from "../../../credentials/client";
import Link from 'next/link';
import { connect } from "react-redux";

const ProductsPage = ({ lang, products }) => {
    return (
        <Layout>
            <div className="container">
                <h1>Products</h1>
                <AddProductForm />
                <div className="products">
                    {products.map((product, i) => {
                        product = product[Object.keys(product)[0]]
                        return (
                            <div className="products-product" key={i}>
                                <div className="products-product-name">Name: <Link href={`/[lang]/p/${product.name}`} as={`/${lang}/p/${product.name}`}>{product.name}</Link></div>
                                <div className="products-product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
                            </div>
                        )
                    })}
                </div>            
            </div>
            <style jsx>{`
                .products {
                    margin-top: 35px;
                }
                    .products-product {
                        border-bottom: 2px solid #ccc;
                        margin-top: 35px;
                    }
                        .products-product:first-of-type {
                            margin: 0;
                        }
                        .products-product:last-of-type {
                            border-bottom: none;
                        }
            `}</style>
        </Layout>
    );
};

ProductsPage.getInitialProps = async ({ reduxStore, res }) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };
    const db = firebase.app().firestore();
    const productsCollection = db.collection("products")
    const productsResponse = await productsCollection.get()
    const products = productsResponse.docs.map(d => {
        return {
            [d.id]: d.data()
        };
    })
    return { products }
}

export default connect(state => state)(ProductsPage);
