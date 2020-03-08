import React from 'react'
import NewsLetterForm from './NewsLetterForm'
import { connect } from "react-redux";

const NewsLetterOr = ({ children, user }) => {
    if (user.isSubscribedToNewsletter){
        return children
    }
    return <NewsLetterForm />
}

export default connect(state => state)(NewsLetterOr);
