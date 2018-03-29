import * as ActionTypes from '../constants/ActionTypes';

const initState = {
  lastDrewFrame: null,
  millisecond: -1,
  frame: null,
  points: [],
  redraw: false,
};

function findFrame(state, ms) {
  if (!state.blocks || !state.blocks.length) {
    return null;
  }

  let frame = null;
  let block = null;
  const lastBlock = state.blocks[state.blocks.length - 1];

  state.blocks.forEach(b => {
    if (ms <= b.end && ms >= b.start) {
      block = b;
    }
  });

  if (!block && ms > lastBlock.end) {
    block = lastBlock;
  }

  if (block) {
    for (let i = 0; i < block.frames.length; i++) {
      const f = block.frames[i];
      if (f.millisecond > ms) {
        break;
      }
      frame = f;
    }
  }
  return frame;
}

function timeUpdate(state, action, type = 'whiteboard1') {
  let points = null;
  const whiteboard = action.state.lecture[type];

  const millisecond = Math.floor((action.currentTime || 0) * 1000);
  if (!whiteboard || millisecond === state.millisecond) {
    return state;
  }
  const frame = findFrame(whiteboard, millisecond);
  if (frame === state.lastDrewFrame) {
    return Object.assign({}, state, {
      millisecond,
    });
  }

  const redraw = true;
  if (!frame) {
    return Object.assign({}, state, {
      millisecond,
      frame,
      redraw,
      points: [],
    });
  }

  const blockIndex = frame.blockIndex;
  const block = whiteboard.blocks[blockIndex];
  points = block.points.slice(0, frame.end + 1);
  return Object.assign({}, state, {
    millisecond,
    frame,
    redraw,
    points: Object.assign([], points),
  });
}

export default function (type) {
  return (state = initState, action) => {
    switch (action.type) {
      case ActionTypes.WHITEBOARD_TIMEUPDATE:
      case ActionTypes.PLAYER_TIMEUPDATE:
        return timeUpdate(state, action, type);
      case ActionTypes.WHITEBOARD_DRAW_SUCCESS:
        if (action.whiteboard === type) {
          return Object.assign({}, state, {
            lastDrewFrame: action.frame,
            redraw: false,
          });
        }
        return state;
      case ActionTypes.PLAYER_EXIT:
      case ActionTypes.ACCOUNT_LOGOUT:
        return initState;
      default:
        return state;
    }
  };
}
