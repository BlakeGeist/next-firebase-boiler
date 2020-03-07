import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import axios from "axios";
import { translate } from "../../../../../helpers/quickHelpers";

const Form = ({ strings, pageStrings, lang }) => {
    const convertToSlug = (text) => {
        return text
            .toUpperCase()
            .replace(/[^\w ]+/g,"")
            .replace(/ +/g,"-");
    };
          
    return (
        <Formik
            initialValues={{ string_name: "", string_value: "", string_scope: "" }}
            validate={values => {
                const errors = {};
                if (!values.string_name) {
                    errors.string_name = "Required";
                } else if (!values.string_value) {
                    errors.string_value = "Required";
                } else if (!values.string_scope) {
                    errors.string_scope = "Required";
                }              
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                const formData =JSON.stringify(values, null, 2);
                const response = axios.post("/api/translate", {
                    text: values.string_name,
                    slug: values.string_value,
                    scope: values.string_scope
                }, {
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                setSubmitting(false);
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
            }) => (
                <form onSubmit={handleSubmit}>
                    <label>
                        <div>{translate("STRING-NAME", pageStrings, lang)}</div>
                        <input
                            type="text"
                            name="string_name"
                            onChange={ e => {
                                setFieldValue("string_value", convertToSlug(e.target.value), true);
                                handleChange(e);
                            }
                            }
                            onBlur={handleBlur}
                            value={values.string_name}
                        />
                        {errors.string_name && touched.string_name && errors.string_name}
                    </label>
                    <label>
                        <div>{translate("STRING-VALUE", pageStrings, lang)}</div>
                        <input
                            type="text"
                            name="string_value"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.string_value}
                        />
                        {errors.string_value && touched.string_value && errors.string_value}
                    </label>
                    <label>
                        <div>{translate("STRING-SCOPE", pageStrings, lang)}</div>
                        <input
                            type="text"
                            name="string_scope"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.string_scope}
                        />
                        {errors.string_scope && touched.string_scope && errors.string_scope}
                    </label>                
                    <button type="submit" disabled={isSubmitting}>{translate("SUBMIT", strings, lang)}</button>
                </form>
            )}
        </Formik>
    );
}; 

export default connect(state => state)(Form);