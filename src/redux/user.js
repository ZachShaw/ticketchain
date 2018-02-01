import { handleActions, createAction } from 'redux-actions';
import { fetchActions, fetchSuccess } from './utils.js';
import { browserHistory } from 'react-router'
import store from '../store'
import AuthenticationContract from '../../build/contracts/Authentication.json'

const contract = require('truffle-contract')

export const LOGIN = 'ticketchain/login/login';
const loginActions = fetchActions(LOGIN);
export const LOGOUT = 'ticketchain/login/logout';
export const FETCH_USER = 'ticketchain/user/fetch_user';
const fetchUserActions = fetchActions(FETCH_USER);

export function loginUser() {
  let web3 = store.getState().web3.web3Instance
  if (typeof web3 !== 'undefined') {
    return (dispatch) => {
      dispatch(loginActions.started());

      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)
      var authenticationInstance

      web3.eth.getCoinbase((error, coinbase) => {
        if (error) { console.error(error); }

        authentication.deployed().then((instance) => {
          authenticationInstance = instance
          authenticationInstance.login({from: coinbase})
          .catch((error) => {
            console.error('Wallet ' + coinbase + ' does not have an account!')
            dispatch(loginActions.error(error));
            Promise.reject(error);
            return browserHistory.push('/signup')
          })
          .then((result) => {
            var name = web3.toUtf8(result[0]);
            var email = web3.toUtf8(result[1]);
            var username = web3.toUtf8(result[2]);

            dispatch(loginActions.success({name, email, username}))

            var currentLocation = browserHistory.getCurrentLocation()

            if ('redirect' in currentLocation.query) {
              return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            }

            return browserHistory.push('/dashboard')
          })
        })
      })
    }
  }
}

export function signUpUser(name, email, username) {
  let web3 = store.getState().web3.web3Instance

  if (typeof web3 !== 'undefined') {

    return (dispatch) => {
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)

      var authenticationInstance

      web3.eth.getCoinbase((error, coinbase) => {
        if (error) {
          console.error(error);
        }

        authentication.deployed().then((instance) => {
          authenticationInstance = instance
          authenticationInstance.signup(name, email, username, {from: coinbase})
          .then((result) => {
            return dispatch(loginUser())
          })
          .catch((result) => {
          })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.');
  }
}

export function fetchUser(address) {
  let web3 = store.getState().web3.web3Instance

  if (typeof web3 !== 'undefined') {
    return (dispatch) => {
      dispatch(fetchUserActions.started());
      const authentication = contract(AuthenticationContract)
      authentication.setProvider(web3.currentProvider)
      var authenticationInstance

      authentication.deployed().then((instance) => {
        authenticationInstance = instance;

        return authenticationInstance.getUser(address);
      }).then((user) => {
        const utfUser = {
          address,
          name: web3.toUtf8(user[0]),
          email: web3.toUtf8(user[1]),
          username: web3.toUtf8(user[2]),
        }
        dispatch(fetchUserActions.success(utfUser))
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}

export function logout () {
  return createAction(LOGOUT)();
}

const initialState = { data: null, users: [] };

export default handleActions({
  [fetchSuccess(LOGIN)]: (state, action) => {
      return {
          ...state,
          data: action.payload
      };
  },
  [fetchSuccess(FETCH_USER)]: (state, action) => {
    const { users } = state;
    if (!users.includes(action.payload)) {
      users.push(action.payload);
    }
    
    return {
        ...state,
        users
    };
  },
  [LOGOUT]: () => initialState
}, initialState);