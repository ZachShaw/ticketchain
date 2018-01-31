import {
  fetchStarted,
  fetchSuccess,
  fetchError
} from './utils.js';

const initialState = {
  loading: {},
  errored: {}
};

const fetchStartedSuffix = fetchStarted('');
const fetchSuccessSuffix = fetchSuccess('');
const fetchErrorSuffix = fetchError('');

function updateState(state, typePrefix, loading, errored) {
  return {
      ...state,
      loading: {
          ...state.loading,
          [typePrefix]: loading
      },
      errored: {
          ...state.errored,
          [typePrefix]: errored
      }
  };
}

export default function reducer(state = initialState, action) {
  let {
      type
  } = action;

  let typePrefix = type.substring(0, type.lastIndexOf('/'));

  if (type.endsWith(fetchStartedSuffix)) {
      return updateState(state, typePrefix, true, false);
  }

  if (type.endsWith(fetchSuccessSuffix)) {
      return updateState(state, typePrefix, false, false);
  }

  if (type.endsWith(fetchErrorSuffix)) {
      return updateState(state, typePrefix, false, action.payload);
  }

  return state;
}