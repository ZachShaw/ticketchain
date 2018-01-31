import { handleActions } from 'redux-actions';
import { fetchSuccess } from './utils.js';

export const WEB3_INITIALIZED = 'ticketchain/web3/web3initialized';

const initialState = {
  web3Instance: null
}

export default handleActions({
  [fetchSuccess(WEB3_INITIALIZED)]: (state, action) => {
      return {
          ...state,
          web3Instance: action.payload.web3Instance
      };
  }
}, initialState);
