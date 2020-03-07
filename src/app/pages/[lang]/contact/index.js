import React from "react";
import Layout from "../../../layouts/Layout";
import ContactForm from "./ContactForm";
import { connect } from "react-redux";
import { translate } from "../../../helpers/quickHelpers";

const Contact = ({ pageStrings, lang }) => {
    return (
        <Layout>
            <div className="container">
                <h1>{translate("CONTACT-US", pageStrings, lang)}</h1>
                <ContactForm />
            </div>
        </Layout>
    );
};

export default connect(state => state)(Contact);
