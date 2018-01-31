import { connect } from 'react-redux'
import SignUpForm from './SignUpForm'
import { signUpUser } from './SignUpFormActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUpFormSubmit: (name, email, username) => {
      dispatch(signUpUser(name, email, username))
    }
  }
}

const SignUpFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpForm)

export default SignUpFormContainer
