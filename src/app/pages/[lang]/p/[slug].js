import React from 'react';
import { connect } from "react-redux";
import Layout from "../../../layouts/Layout";
import axios from 'axios';
import absoluteUrl from '../../helpers/getAbsoluteUrl'

const Product = ({ product }) => {
    return (
        <Layout>
            <div className="container">
                <h1>{product.name}</h1>
                <div className="products-product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
        </Layout>
    )
}

Product.getInitialProps = async ({ req, query  }) => {
    const { apiURL } = absoluteUrl(req);
    const productResp = await axios.post(`${apiURL}/api/getProductBySlug`, {slug: query.slug});
    const product = productResp.data;
    return { product };
}

export default connect(state => state)(Product);
