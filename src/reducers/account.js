import * as ActionTypes from '../constants/ActionTypes';
import createReducer from '../utils/create-reducer';
const initState = {
  username: null,
  token: null,
  loading: false,
  error: '',
  authenticated: false,
};

const actionHandler = {
  [ActionTypes.ACCOUNT_LOGIN_LOADING]: (state, action) => (
    Object.assign({}, state, {
      loading: action.loading,
    })
    ),

  [ActionTypes.ACCOUNT_LOGIN_SUCCESS]: (state, action) => (
    Object.assign({}, state, {
      username: action.username,
      token: action.token,
      authenticated: true,
      loading: false,
    })
  ),

  [ActionTypes.ACCOUNT_LOGIN_ERROR]: (state, action) => (
    Object.assign({}, state, {
      error: action.message,
      loading: false,
    })
  ),

  [ActionTypes.ACCOUNT_LOGOUT]: (state, action) => (
    initState
  ),
};

export default createReducer(initState, actionHandler);
