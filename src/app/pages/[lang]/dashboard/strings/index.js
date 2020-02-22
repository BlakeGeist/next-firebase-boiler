import React from 'react'
import { connect } from 'react-redux'
import Layout from '../../../../layouts/Layout';
import 'firebase/firestore'
import axios from 'axios';
import _ from 'lodash'
import { translate } from '../../../../helpers/quickHelpers';
import Form from './components/Form'

const StringsPage = ({ strings, pageStrings, lang }) => {

      return (
        <Layout>
          <h2>{translate('STRINGS', strings, lang)}</h2>
          <div>
            <h1>{translate('ANYWHERE-IN-YOUR-APP', pageStrings, lang)}</h1>
            <Form />
          </div>        
        </Layout>
      )
}

export default connect(state => state)(StringsPage);
