import { handleActions } from 'redux-actions';
import { fetchActions } from './utils.js';
import Web3 from 'web3'

export const WEB3_INITIALIZED = 'ticketchain/web3/web3initialized';
const web3Actions = fetchActions(WEB3_INITIALIZED);

export function getWeb3() {
  return (dispatch) => {
    dispatch(web3Actions.started());
    window.addEventListener('load', function(dispatch) {
      var results
      var web3 = window.web3
  
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        web3 = new Web3(web3.currentProvider)
  
        results = {
          web3Instance: web3
        }
  
        console.log('Injected web3 detected.');
  
        dispatch(web3Actions.success(results))
      } else {
        
        var provider = new Web3.providers.HttpProvider('http://localhost:8545')
  
        web3 = new Web3(provider)
  
        results = {
          web3Instance: web3
        }
  
        console.log('No web3 instance injected, using Local web3.');
  
        dispatch(web3Actions.success(results))
      }
    })
  }
}

const initialState = {
  web3Instance: null
}

export default handleActions({
  [WEB3_INITIALIZED]: (state, action) => {
      return {
          ...state,
          web3Instance: action.payload.web3Instance
      };
  }
}, initialState);
