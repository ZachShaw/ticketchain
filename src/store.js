import { browserHistory } from 'react-router'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import * as reducer from './redux/index.js';
import {autoRehydrate} from 'redux-persist';
import { createLogger } from 'redux-logger'

const logger = createLogger({
  collapsed: true,
});

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routingMiddleware = routerMiddleware(browserHistory)

const store = createStore(
  combineReducers({
    routing: routerReducer,
    ...reducer
  }),
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routingMiddleware,
      logger
    ),
    autoRehydrate()
  )
)

export default store
