import React, { Component } from 'react'

class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Welcome to TicketChain</h1>
          </div>
          <div className="pure-u-1-1">
            <p>Please sign in using your Ether wallet address via Chome Extension MetaMask</p>
          </div>
        </div>
      </main>
    )
  }
}

export default Home
