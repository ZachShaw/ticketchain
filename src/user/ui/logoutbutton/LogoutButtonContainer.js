import { connect } from 'react-redux'
import LogoutButton from './LogoutButton'
import { logout } from '../../../redux/user.js'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  onLogout: () => dispatch(logout())
});

const LogoutButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogoutButton)

export default LogoutButtonContainer
