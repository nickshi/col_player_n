import * as ActionTypes from '../constants/ActionTypes';

const initState = {
  error: null,
  lastDrewIndex: -1,
  second: -1,
  index: -1,
  dirtyFrame: null,
};

export default function (state = initState, action) {
  switch (action.type) {
    case ActionTypes.SCREENSHOT_TIMEUPDATE_LOCAL:
      return Object.assign({}, state, action.state);
    case ActionTypes.PLAYER_EXIT:
      return initState;
    case ActionTypes.ACCOUNT_LOGOUT:
      return initState;
    default:
      return state;
  }
}
