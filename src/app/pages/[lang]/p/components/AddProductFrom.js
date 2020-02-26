
import './rich-editor.css';

import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import { translate } from "../../../../helpers/quickHelpers";
import { EditorState, convertToRaw } from 'draft-js';
import { RichEditorExample } from './RichEditor';

const AddProductFrom = ({ strings, pageStrings, lang }) => {

    const dis = new EditorState.createEmpty()

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
              const contentState = values.editorState.getCurrentContent()
              const editorContentRaw = convertToRaw(contentState);
              console.log(editorContentRaw)
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

                <RichEditorExample
                    editorState={values.editorState}
                    onChange={setFieldValue}
                    onBlur={handleBlur}
                  />   

                  <div>{translate("DESCRIPTION", pageStrings, lang)}</div>
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
      `}</style>                
              </form>
            )}

          </Formik>
    );
};

export default connect(state => state)(AddProductFrom);
