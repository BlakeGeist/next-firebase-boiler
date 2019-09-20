import React, { useEffect } from 'react'

const AuthForm = ({email, password, handleChange, handleEmailPassAuth}) => {
  return (
    <form onSubmit={handleEmailPassAuth}>
      <div><input type="email" placeholder="Email" value={email} name="email" onChange={handleChange} required /></div>
      <div><input type="password" placeholder="Password" value={password} name="password" onChange={handleChange} required /></div>
      <div><input type="submit" /></div>
    </form>
  )
}

export default AuthForm;
