import * as ActionTypes from '../constants/ActionTypes';


export function play() {
  return {
    type: ActionTypes.PLAYER_PLAY,
  };
}

export function pause() {
  return {
    type: ActionTypes.PLAYER_PAUSE,
  };
}

export function mute(muted) {
  return {
    type: ActionTypes.PLAYER_MUTE,
    muted,
  };
}

export function autoPause() {
  return {
    type: ActionTypes.PLAYER_AUTOPAUSE,
  };
}

export function loadStart(data) {
  return {
    type: ActionTypes.PLAYER_LOADSTART,
    player: data,
  };
}

export function canPlay(data) {
  return {
    type: ActionTypes.PLAYER_CANPLAY,
    player: data,
  };
}

export function canPlayThrough() {
  return {
    type: ActionTypes.PLAYER_CANPLAYTHROUGH,
  };
}

export function playing() {
  return {
    type: ActionTypes.PLAYER_PLAYING,
  };
}

export function firstPlay() {
  return {
    type: ActionTypes.PLAYER_FIRSTPLAY,
  };
}

export function rateChange(playbackRate) {
  return {
    type: ActionTypes.PLAYER_RATECHANGE,
    playbackRate,
  };
}

export function volumeChange(volume) {
  return {
    type: ActionTypes.PLAYER_VOLUMECHANGE,
    volume,
  };
}

export function durationChange(duration) {
  return {
    type: ActionTypes.PLAYER_DURATIONCHANGE,
    duration,
  };
}

export function progressChange(buffered) {
  return {
    type: ActionTypes.PLAYER_PROGRESSCHANGE,
    buffered,
  };
}

export function end() {
  return {
    type: ActionTypes.PLAYER_END,
  };
}

export function waiting() {
  return {
    type: ActionTypes.PLAYER_WAITING,
  };
}

export function seeking() {
  return {
    type: ActionTypes.PLAYER_SEEKING,
  };
}

export function seeked() {
  return {
    type: ActionTypes.PLAYER_SEEKED,
  };
}

export function fullscreenChange(isFullscreen) {
  return {
    type: ActionTypes.PLAYER_FULLSCREENCHANGE,
    isFullscreen,
  };
}

export function changeOrientation() {
  return {
    type: ActionTypes.PLAYER_ORIENTATION,
  };
}

export function timeUpdate(currentTime) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.PLAYER_TIMEUPDATE,
      currentTime,
      state: getState(),
    });
  };
}

export function resize(width, height, windowWidth, windowHeight) {
  return {
    type: ActionTypes.PLAYER_RESIZE,
    width,
    height,
    windowWidth,
    windowHeight,
  };
}

export function relayout(data) {
  return {
    type: ActionTypes.PLAYER_RELAYOUT,
    layout: data,
  };
}

export function changeScreenRatio(ratio) {
  return {
    type: ActionTypes.PLAYER_CHANGE_SCREEN_RATIO,
    ratio,
  };
}

export function playerExit() {
  return {
    type: ActionTypes.PLAYER_EXIT,
  };
}

export function activate(actives, fullscreen) {
  return {
    type: ActionTypes.PLAYER_ACTIVATE,
    actives,
    fullscreen,
  };
}

