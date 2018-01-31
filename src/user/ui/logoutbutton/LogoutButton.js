import React from 'react'

const LogoutButton = ({ onLogout }) => {
  return(
    <li className="pure-menu-item">
      <a href="#" className="pure-menu-link" onClick={(event) => onLogout(event)}>Logout</a>
    </li>
  )
}

export default LogoutButton
