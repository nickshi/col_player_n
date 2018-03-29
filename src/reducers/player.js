import * as ActionTypes from '../constants/ActionTypes';
import createReducer from '../utils/create-reducer';

const initState = {
  duration: 0,
  currentTime: 0,
  rate: 1,
  buffered: null,
  waiting: true,
  seeking: false,
  paused: false,
  autoPaused: false,
  ended: false,
  playbackRate: 1,
  muted: false,
  volume: 1,
  isFullscreen: false,
  readyState: 0,
  networkState: 0,
  videoWidth: 0,
  videoHeight: 0,
  hasStarted: false,
  error: null,
};


const actionHandler = {
  [ActionTypes.PLAYER_LOADSTART]: (state, action) => (
    Object.assign({}, state, action.player)
  ),
  [ActionTypes.PLAYER_EXIT]: () => (
    initState
  ),
  [ActionTypes.PLAYER_PAUSE]: (state) => (
    Object.assign({}, state, { paused: true })
  ),
  [ActionTypes.PLAYER_PLAY]: (state) => (
    Object.assign({}, state, {
      paused: false,
      autoPaused: false,
      waiting: false,
    })
  ),
  [ActionTypes.PLAYER_AUTOPAUSE]: (state) => {
    Object.assign({}, state, {
      autoPaused: true,
      waiting: true,
    })
  },
  [ActionTypes.PLAYER_TIMEUPDATE]: (state, action) => (
    Object.assign({}, state, { currentTime: action.currentTime })
  ),
  [ActionTypes.PLAYER_DURATIONCHANGE]: (state, action) => (
    Object.assign({}, state, { duration: action.duration })
  ),
  [ActionTypes.PLAYER_RATECHANGE]: (state, action) => (
    Object.assign({}, state, { rate: action.playbackRate })
  ),
  [ActionTypes.PLAYER_SEEKING]: (state) => (
    Object.assign({}, state, { seeking: true })
  ),
  [ActionTypes.PLAYER_SEEKED]: (state) => (
    Object.assign({}, state, { seeking: false })
  ),
  [ActionTypes.ACCOUNT_LOGOUT]: () => (
    initState
  ),
};
export default createReducer(initState, actionHandler);
