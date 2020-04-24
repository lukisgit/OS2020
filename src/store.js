import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import memory from './conatiners/memory/reducer';

export const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  memory
});

export const makeStore = (initialState, options) => {
  return createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware, logger));
};
