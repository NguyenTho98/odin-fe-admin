import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleWare = composeEnhancers(
  applyMiddleware(
    thunk,
    createLogger({
      predicate: () => {
        return true;
      },
    })
  )
);

const store = createStore(reducers, middleWare);

export default store;
