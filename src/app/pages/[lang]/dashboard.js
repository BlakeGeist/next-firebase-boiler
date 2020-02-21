import React, { useState } from 'react';
import { connect } from 'react-redux'
import Layout from '../../layouts/Layout';
import firebase from 'firebase/app'
import 'firebase/firestore'
import clientCredentials from '../../../functions/credentials/client'
import { Formik } from 'formik';
import axios from 'axios';
import _ from 'lodash'

const qs = require('qs');

const Dashbaord = ({ user, modalIsOpen, dispatch, strings, lang }) => {

  const translate = (string) => { 
    return strings[string][lang]
  }

  const Strings = () => {

    const convertToSlug = (text) => {
      return text
          .toUpperCase()
          .replace(/[^\w ]+/g,'')
          .replace(/ +/g,'-')
    }
    
    return (
      <div>
        <h2>{translate('STRINGS')}</h2>
        <div>
          <h1>Anywhere in your app!</h1>
          <Formik
            initialValues={{ string_name: '', string_value: '', string_scope: '' }}
            
            validate={values => {
              const errors = {};
              if (!values.string_name) {
                errors.string_name = 'Required';
              } else if (!values.string_value) {
                errors.string_value = 'Required';
              } else if (!values.string_scope) {
                errors.string_scope = 'Required';
              }              
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const formData =JSON.stringify(values, null, 2)
              const response = axios.post('/api/translate', {
                text: values.string_name,
                slug: values.string_value
              }, {
                headers: {
                    'Content-Type': 'application/json',
                }
              })

              console.log(response)

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
                  <div>String Name</div>
                  <input
                    type="text"
                    name="string_name"
                    onChange={ e => {
                        setFieldValue('string_value', convertToSlug(e.target.value), true)
                        handleChange(e)
                      }
                    }
                    onBlur={handleBlur}
                    value={values.string_name}
                  />
                  {errors.string_name && touched.string_name && errors.string_name}
                </label>
                <label>
                 <div>String Value</div>
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
                 <div>String Scope</div>
                  <input
                    type="text"
                    name="string_scope"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.string_scope}
                  />
                  {errors.string_scope && touched.string_scope && errors.string_scope}
                </label>                
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>        
      </div>
    )
  }

  return (
    <Layout pageMod="dashboard" isAuthedRequired={true}>
     
     {user.email}

      <hr />

      <Strings />

      <style global jsx>{`
        .cards {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      `}</style>
    </Layout>
  )
}

export default connect(state => state)(Dashbaord);
