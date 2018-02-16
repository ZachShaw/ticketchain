import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'
import { connect } from 'react-redux';

// UI Components
import LoginButtonContainer from './user/components/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/components/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

// Actions
import { getWeb3 } from './redux/web3.js';

class App extends Component {

  componentWillMount() {
    // this.props.getWeb3();
  }

  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/tickets" className="pure-menu-link">Tickets</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/manage" className="pure-menu-link">Manage</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/signup" className="pure-menu-link">Sign Up</Link>
        </li>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
          <Link to="/" className="pure-menu-heading pure-menu-link">TicketChain</Link>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch) => ({
  getWeb3: (username, password) => dispatch(getWeb3())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
