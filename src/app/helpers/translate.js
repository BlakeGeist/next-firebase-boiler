import { connect } from 'react-redux';
import withReduxStore from '../lib/reducers'

const translate = ({string, strings, lang}) => {
    console.log(string)
    const translate = (string) => { 
        if (strings[string] && strings[string][lang]) return strings[string][lang]
        return null
      }
    return translate(string)
}

export default withReduxStore(translate)