
import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import { translate } from "../../../../helpers/quickHelpers";
import { EditorState, convertToRaw } from "draft-js";
import RichEditorExample from "./RichEditor";
import {stateToHTML} from "draft-js-export-html";
import createLinkifyPlugin from "draft-js-linkify-plugin";
import firebase from "firebase/app";
import "firebase/auth";

const AddProductFrom = ({ strings, pageStrings, lang }) => {

    const db = firebase.firestore();
    const dis = new EditorState.createEmpty();
    const linkifyPlugin = createLinkifyPlugin();
    const plugins = [linkifyPlugin];

    return (
        <Formik
            initialValues={{ name: "", editorState: dis }}
            validate={values => {
                const errors = {};
                if (!values.name) {
                    errors.name = "Required";
                }     
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                const contentState = values.editorState.getCurrentContent();
                let html = stateToHTML(contentState);

                const productsCollection = db.collection("products");
                const product = {
                  name: values.name,
                  description: html
                }
                await productsCollection.doc(values.name).set(product)
                    .then(()=>{
                    })
                    .catch((e)=>{
                        res.json({ error: e });
                    });
                  

                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                handleBlur
            }) => (
                <form onSubmit={handleSubmit}>
                    <label>
                        <div>{translate("PRODUCT-NAME", pageStrings, lang)}</div>
                        <Field name="name" className="form-input"/>
                        {errors.name && touched.name && errors.name}
                    </label> 
                    <label>
                        <div>{translate("DESCRIPTION", pageStrings, lang)}</div>
                        <RichEditorExample
                            editorState={values.editorState}
                            onChange={setFieldValue}
                            onBlur={handleBlur}
                            plugins={plugins}
                        />
                        {errors.editorState && touched.editorState && errors.editorState}
                    </label> 
                    <button type="submit" disabled={isSubmitting}>{translate("SUBMIT", strings, lang)}</button>
                    <style global jsx>{`
                      .RichEditor-root {
                        background: #fff;
                        border: 1px solid #ddd;
                        font-family: 'Georgia', serif;
                        font-size: 14px;

                        padding: 15px;
                      }

                      .RichEditor-editor {
                        border-top: 1px solid #ddd;
                        cursor: text;
                        font-size: 16px;
                        margin-top: 10px;
                      }

                      .RichEditor-editor .public-DraftEditorPlaceholder-root,
                      .RichEditor-editor .public-DraftEditor-content {
                        margin: 0 -15px -15px;
                        padding: 15px;
                      }

                      .RichEditor-editor .public-DraftEditor-content {
                        min-height: 100px;
                      }

                      .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root {
                        display: none;
                      }

                      .RichEditor-editor .RichEditor-blockquote {
                        border-left: 5px solid #eee;
                        color: #666;
                        font-family: 'Hoefler Text', 'Georgia', serif;
                        font-style: italic;
                        margin: 16px 0;
                        padding: 10px 20px;
                      }

                      .RichEditor-editor .public-DraftStyleDefault-pre {
                        background-color: rgba(0, 0, 0, 0.05);
                        font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
                        font-size: 16px;
                        padding: 20px;
                      }

                      .RichEditor-controls {
                        font-family: 'Helvetica', sans-serif;
                        font-size: 14px;
                        margin-bottom: 5px;
                        user-select: none;
                      }

                      .RichEditor-styleButton {
                        color: #999;
                        cursor: pointer;
                        margin-right: 16px;
                        padding: 2px 0;
                        display: inline-block;
                      }

                      .RichEditor-activeButton {
                        color: #5890ff;
                      }  
                      .draftJsLinkifyPlugin__link__2ittM, .draftJsLinkifyPlugin__link__2ittM:visited {
                        color: #5e93c5;
                        text-decoration: none;
                      }

                      .draftJsLinkifyPlugin__link__2ittM:hover, .draftJsLinkifyPlugin__link__2ittM:focus {
                        color: #7eadda;
                        outline: 0; /* reset for :focus */
                        cursor: pointer;
                      }
                      .draftJsLinkifyPlugin__link__2ittM:active {
                        color: #4a7bab;
                      }
                    `}</style>                
                </form>
            )}

        </Formik>
    );
};

export default connect(state => state)(AddProductFrom);
