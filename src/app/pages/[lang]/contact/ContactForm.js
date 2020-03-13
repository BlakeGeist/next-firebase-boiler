import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import { translate } from "../../../helpers/quickHelpers";

import axios from "axios";

const ContactForm = ({ strings, pageStrings, lang }) => {
    return (
        <Formik
            initialValues={{ name: "", email: "", message: "" }}
            validate={values => {
                const errors = {};
                if (!values.name) {
                    errors.name = "Required";
                } else if (!values.email) {
                    errors.email = "Required";
                } else if (!values.message) {
                    errors.message = "Required";
                }              
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                const response = await axios.post("/api/sendContactMessage", values);
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
                    <label>
                        <div>{translate("EMAIL", pageStrings, lang)}</div>
                        <Field name="email" className="form-input"/>
                        {errors.email && touched.email && errors.email}
                    </label> 
                    <label>
                        <div>{translate("MESSAGE", pageStrings, lang)}</div>
                        <Field name="message" as="textarea"  className="form-input"/>
                        {errors.message && touched.message && errors.message}
                    </label>
                    <button type="submit" disabled={isSubmitting}>{translate("SUBMIT", strings, lang)}</button>
                </form>
            )}
        </Formik>
    );
};

export default connect(state => state)(ContactForm);
