import React from 'react'

const LoginButton = ({ onLoginUser }) => {
  return(
    <li className="pure-menu-item">
      <a href="#" className="pure-menu-link" onClick={(event) => onLoginUser(event)}>Login</a>
    </li>
  )
}

export default LoginButton
