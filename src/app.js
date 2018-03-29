import Routes from './Routes';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import React from 'react';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
// other imports...

// create store...
const logger = createLogger();
const middleware = [thunk];

const store = compose(
  applyMiddleware(...middleware)
)(createStore)(reducers);


export default function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
