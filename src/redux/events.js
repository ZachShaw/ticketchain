import Api from '../api.js';
import { handleActions } from 'redux-actions';
import { fetchActions, fetchSuccess } from './utils.js';

export const SEARCH_EVENTS = 'ticketchain/events/events-search';
const searchEventsActions = fetchActions(SEARCH_EVENTS);

export function searchEvents(keyword) {
    return (dispatch) => {
        dispatch(searchEventsActions.started());

        return Api.get(`/events/search/?api_key=${process.env.SKIDDLE_API_KEY}&keyword=${keyword}`)
            .catch((err) => {
                dispatch(searchEventsActions.error(err));
                return Promise.reject(err);
            })
            .then((res) => dispatch(searchEventsActions.success(res.data)));
    };
}

const initialState = {
  data: []
}

export default handleActions({
  [fetchSuccess(SEARCH_EVENTS)]: (state, action) => {
      return {
          ...state,
          data: action.payload
      };
  }
}, initialState);