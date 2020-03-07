import React from "react";
import Layout from "../../../layouts/Layout";
import AddProductForm from "./components/AddProductFrom";

const ProductsPage = () => {
    return (
        <Layout>
            <div className="container">
                <h1>Products</h1>
                <AddProductForm />
            </div>
        </Layout>
    );
};

export default ProductsPage;