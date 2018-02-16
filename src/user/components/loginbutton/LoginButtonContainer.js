import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import { loginUser } from '../../../redux/user.js'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  onLoginUser: () => dispatch(loginUser())
});

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
