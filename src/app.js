import Routes from './Routes';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import React from 'react';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
// other imports...

// create store...

const middlewares = [thunk];
// if (__DEV__) {
//   const logger = createLogger();
 
//   middlewares.push(logger)
// }
const store = compose(
  applyMiddleware(...middlewares)
)(createStore)(reducers);


export default function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
