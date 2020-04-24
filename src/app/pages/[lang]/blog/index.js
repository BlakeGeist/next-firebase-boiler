import React, { useState } from "react";
import axios from 'axios';
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import Layout from "../../../layouts/Layout";
import TextEditor from  "../../../components/TextEditor";
import { translate } from "../../../helpers/quickHelpers";
import absoluteUrl from '../../helpers/getAbsoluteUrl'
import CategoriesList from "./components/CategoriesList";

const Blog = ({ lang, pageStrings, strings, categories }) => {
    console.log(categories)
    const [content, setContent] = useState({
        editorContent: '',
        name: ''
    });

    const handleEditorChange = (e) => {
        const editorContent = e.target.getContent();
        setContent({
            ...content,
            editorContent: editorContent
        })
    };

    const handleInputChange = (e) => {
        setContent({
            ...content,
            [e.target.name]: e.target.value
        })
    } 

    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(content)
    }

    return (
        <Layout>
            <div className="container">
                <div className="content">
                    <h1>Blog Page</h1>
                    <label>
                        <div>Title</div>
                        <input onChange={handleInputChange} name="title" type="text" placeholder="Title:" />
                    </label>
                    <TextEditor
                        handleEditorChange={handleEditorChange}
                        handleOnSubmit={handleOnSubmit}
                        />
                </div>
                <aside className="">
                    <h2>Categories</h2>
                    <Formik
                        initialValues={{ name: "" }}
                        validate={values => {
                            const errors = {};
                            if (!values.name) {
                                errors.name = "Required";
                            }              
                            return errors;
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                            console.log(values)
                            const response = await axios.post("/api/createCategory", values);
                            console.log(response)
                            setSubmitting(false);
                        }}
                    >
                        {({
                            errors,
                            touched,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <label>
                                    <div>{translate("NAME", pageStrings, lang)}</div>
                                    <Field name="name" className="form-input"/>
                                    {errors.name && touched.name && errors.name}
                                </label>
                                <button type="submit" disabled={isSubmitting}>{translate("SUBMIT", strings, lang)}</button>
                            </form>
                        )}
                    </Formik>
                    <CategoriesList 
                        categories={categories}
                        />
                </aside>
            </div>
            <style jsx>{`
                .container {
                    display: flex;
                }
            `}</style>
        </Layout>
    );
};

Blog.getInitialProps = async ({ req, query  }) => {
    const { apiURL } = absoluteUrl(req);
    const categoriesResponse = await axios.post(`${apiURL}/api/getBlogCategories`);
    const categories = categoriesResponse.data;
    return { categories };
}

export default connect(state => state)(Blog);
