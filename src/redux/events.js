import Api from '../api.js';
import { handleActions, createAction } from 'redux-actions';
import { fetchActions, fetchSuccess } from './utils.js';

export const SEARCH_EVENTS = 'ticketchain/events/events-search';
const searchEventsActions = fetchActions(SEARCH_EVENTS);
export const SELECT_EVENT = 'ticketchain/events/select-event';

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

export function selectEvent(event) {
    return createAction(SELECT_EVENT)(event)
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
  },
  [SELECT_EVENT]: (state, action) => {
      return {
          ...state,
          selected: action.payload
      }
  }
}, initialState);