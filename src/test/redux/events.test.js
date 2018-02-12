import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import toBeType from "jest-tobetype";
expect.extend(toBeType);
import * as reducer from '../../redux/index.js';
import Api from '../../api.js';
import config from '../../config/config.development';
import { searchEvents, SEARCH_EVENTS, selectEvent, SELECT_EVENT } from '../../redux/events.js';

const mockEventApi = `/events/search/?api_key=${process.env.SKIDDLE_API_KEY}&keyword=test`

const mock = {
  eventsResponseSuccess: {
    data: {
      success: true
    }
  },
  eventsResponseError: {
    data: {
      success: false,
      message: 'Something went wrong!'
    }
  }
}

const initState = {
  data: []
};

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore(initState, {});

describe('Events duck', () => {

  describe("[Reducer] - events", () => {
    it('Should be a function', () => {
      expect(reducer.events).toBeType('function');
    })

    it('Should initialize with correct state', () => {
      const state = reducer.user(initState, {});
      const expected = { data: [] };
      expect(state).toEqual(expected)
    })
  })

  describe("[Action] - searchEvent", () => {
    it('Should be a function', () => {
      expect(searchEvents).toBeType('function');
    })

    it('should dispatch the correct actions on success', () => {
      Api.get = sinon.stub().returns(Promise.resolve(mock.eventsResponseSuccess))
      nock(`${config.SKIDDLE_API_URL}${mockEventApi}`)
        .get(mockEventApi)
        .reply(200, mock.eventsResponseSuccess)
      
      const expectedActions = [
        { type: `${SEARCH_EVENTS}/started` },
        { payload: { success: true }, type: `${SEARCH_EVENTS}/success` },
      ];

      return store.dispatch(searchEvents()).then(() => {
        const storeActions = store.getActions();
        expect(storeActions).toEqual(expectedActions);
        store.clearActions();
      })
    })
  })
})