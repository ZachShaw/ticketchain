import React, { Component } from 'react'
import SignUpFormContainer from '../../components/signupform/SignUpFormContainer'

class SignUp extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Sign Up</h1>
            <p>Wallet address dictates accounts for now, just add name and it'll work!</p>
            <SignUpFormContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default SignUp
