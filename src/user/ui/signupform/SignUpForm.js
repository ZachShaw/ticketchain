import React, { Component } from 'react'

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      email: '',
      username: '',
    }

    this.onChangeField = this.onChangeField.bind(this);
  }

  onChangeField = (fieldName) => (e) => this.setState({[fieldName]: e.target.value});

  handleSubmit(event) {
    const { name, email, username } = this.state;
    event.preventDefault()

    if (name.length < 2) {
      return alert('Please fill in your name.')
    }

    if (email.length < 2) {
      return alert('Please fill in your email.')
    }

    if (username.length < 2) {
      return alert('Please fill in your email.')
    }
    
    this.props.onSignUpFormSubmit(name, email, username)
  }

  render() {
    return(
      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
        <fieldset>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={this.state.name} onChange={this.onChangeField('name')} placeholder="Name" />
          <span className="pure-form-message">This is a required field.</span>
          <input id="email" type="text" value={this.state.email} onChange={this.onChangeField('email')} placeholder="Email" />
          <span className="pure-form-message">This is a required field.</span>
          <input id="username" type="text" value={this.state.username} onChange={this.onChangeField('username')} placeholder="Username" />
          <span className="pure-form-message">This is a required field.</span>

          <br />

          <button type="submit" className="pure-button pure-button-primary">Sign Up</button>
        </fieldset>
      </form>
    )
  }
}

export default SignUpForm
