import React from 'react'
import { connect } from 'react-redux';

const Messages = ({ messages }) => {
  const renderMessage = (message, index) => {
    return (
      <li key={index}>
        {message.text}
      </li>
    )
  }
  return (
    <div className="messages-container">
    <h3>Messages:</h3>
      <ul>
        {messages &&
          messages.map((message, i) => renderMessage(message, i))
        }
      </ul>
    </div>
  )
};

export default connect(state => state)(Messages);
