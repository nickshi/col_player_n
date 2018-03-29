import * as ActionTypes from '../constants/ActionTypes';

function whiteboardTimeUpdate(currentTime = 0) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.WHITEBOARD_TIMEUPDATE,
      currentTime,
      state: getState(),
    });
  };
}

function drawWhiteBoard(type, frame) {
  return {
    type: ActionTypes.WHITEBOARD_DRAW_SUCCESS,
    whiteboard: type,
    frame,
  };
}

export default {
  whiteboardTimeUpdate,
  drawWhiteBoard,
};
