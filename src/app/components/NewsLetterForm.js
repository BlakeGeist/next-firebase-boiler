import React from "react";
import { Formik, Field } from "formik";
import { translate } from "../helpers/quickHelpers";
import { connect } from "react-redux";
import axios from "axios";

const NewsLetterForm = ({ user, lang, strings }) => {
    const initalEmail = user.email || '';
    return (
        <Formik
            initialValues={{ email: initalEmail }}
            validate={values => {
                const errors = {};
                if (!values.email) {
                    errors.email = "Required";
                }
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                const payload = {
                    email: values.email
                }
                if(user.uid) {
                    payload.uid = user.uid
                } 
                await axios.post("/api/addEmailToNewsLetter", payload)
            }}
        >
            {({
                errors,
                touched,
                handleSubmit,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit}>
                    <div>{translate("SIGN-UP-FOR-OUR-NEWSLETTER", strings, lang)}</div>
                    <div className="newsLetter-inputs">
                        <label>
                            <Field name="email" className="form-input" placeholder={translate("EMAIL", strings, lang)}/>
                            {errors.email && touched.email && errors.email}
                        </label>
                        <button type="submit" disabled={isSubmitting}>{translate("SUBMIT", strings, lang)}</button>
                    </div>                
                    <style jsx>{`
                    form {
                        text-align: left;
                    }
                    .newsLetter-inputs {
                        display: flex;
                    }
                `}</style>
                </form>
            )}
        </Formik>
    );
};

export default connect(state => state)(NewsLetterForm);
