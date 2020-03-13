import React from "react";
import Layout from "../../../layouts/Layout";
import TextEditor from  "../../../components/TextEditor";

const Blog = ({  }) => {
    return (
        <Layout>
            <div className="container">
                <h1>Blog Page</h1>
                <TextEditor />
            </div>
        </Layout>
    );
};

export default Blog;