import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import Langs from '../helpers/languages'

const Footer = ({ dispatch, lang }) => {
  const router = useRouter()

  const handleLanguageSelectChange = (e) => {
    dispatch({ type: 'SET_ITEM', name: 'lang', payload: e.target.value });
    router.push(`/${e.target.value}`)
  }

  const LanguageSelect = () => {
    console.log(lang)
    const renderOption = (option, i) => {
      return (
        <option key={i} value={option.lang}>{option.name}</option>
      )
    }
    return (
      <select value={lang} onChange={handleLanguageSelectChange}>
        {Langs.map((option, i) => renderOption(option, i))}
      </select>      
    )
  }

  return (
    <>
    <footer>
      <div className="container footer">
        <div className="footer-item">
          <LanguageSelect />
        </div>
        <div className="footer-item">
          item 1
        </div>
        <div className="footer-item">
          item 1
        </div>
        <div className="footer-item">
          item 1
        </div>                        
      </div>
      <div className="container">
        <nav>
          <ul>
            <li>
              <Link href="/terms">
                <a>Terms</a>
              </Link>
            </li>
            <li>
              <Link href="privacy">
                <a>Privacy</a>
              </Link>            
            </li>
          </ul>
        </nav>
      </div>
    </footer>
    <style jsx>{`
      .footer {
        column-count: 4;
        background-color: #fff;
      }
      footer {
        text-align: center;
      }
      footer a {
        color: #067df7;
        -webkit-text-decoration: none;
        text-decoration: none;
        font-size: 13px;
      }
      ul {
        display: flex;
        padding: 0;
        flex: 1 1 auto;
        justify-content: center;
      }
      li {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        text-align: center;
        flex: 0 0 auto;
      }
      li:after {
        content: " | ";
        padding: 0 5px;
      }
      li:last-of-type:after{
        content: "";
      }
      nav {
        display: flex;
        justify-content: space-between;
      }      
    `}</style>
    </>
  )
};

export default connect(state => state)(Footer);
