import _ from 'lodash';
import * as ActionTypes from '../constants/ActionTypes';
import NetworkHelper from '../utils/NetworkHelper';

function loginError(message) {
  return {
    message,
    type: ActionTypes.ACCOUNT_LOGIN_ERROR,
  };
}

function loginSuccess(username, token) {
  return {
    type: ActionTypes.ACCOUNT_LOGIN_SUCCESS,
    username,
    token,
  };
}

function validate(username, password) {
  var message = null;
  if (_.isEmpty(username)) {
    message = "User ID can't be empty";
    return message;
  }

  if (_.isEmpty(password)) {
    message = "password can't be empty";
    return message;
  }
  return message;
}

function logout() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.ACCOUNT_LOGOUT });
  };
}

function login(username, password) {
  return (dispatch) => {
    var errMsg = validate(username, password);
    if (errMsg !== null) {
      dispatch(loginError(errMsg));
      return;
    }

    dispatch({
      type: ActionTypes.ACCOUNT_LOGIN_LOADING,
      loading: true,
    });

    NetworkHelper.signin(username, password, (err, response) => {
      if (err) {
        dispatch(loginError(err.detail));
        return;
      }

      dispatch(loginSuccess(response.username, response.token));
    });
  };
}

function loadLecture(url) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.LECTURE_LOADING,
    });

    fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {
    
    dispatch({
      type: ActionTypes.LECTURE_LOAD_SUCCESS,
      lecture: responseJson,
    });
  })
  .catch((error) => {
    if (error) {
      dispatch({
        type: ActionTypes.LECTURE_LOAD_FAILURE,
        error,
      });
    }
  });
  };
}

export default {
  logout,
  login,
  loadLecture,
};
