import React, { Component } from 'react'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
    const {authData } = this.props;

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {authData.name}!</strong> If you're seeing this page, you've logged in using a smart contract successfully.</p>
            <p><strong>Congratulations {authData.email}!</strong> If you're seeing this page, you've logged in using a smart contract successfully.</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
