import React from "react";
import Layout from "../../../layouts/Layout";
import AddProductForm from './components/AddProductFrom';

const ProductsPage = () => {
    return (
        <Layout>
            <h1>Products</h1>
            <AddProductForm />
        </Layout>
    );
};

export default ProductsPage;