import * as ActionTypes from '../constants/ActionTypes';
import {
  Dimensions,
} from 'react-native';
const { height, width } = Dimensions.get('window');
const multiHeight = height / 2 - width * 3 / 8;
const smallViewWidth = width * 0.2;
const smallViewHeight = smallViewWidth * 3 / 4;
const smallGap = 10;
const landscapeVideoHeight = height;
const landscapeVideoWidth = width - smallViewWidth;

const initialState = {
  active: 'video',
  isPortrait: true,
  control: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: landscapeVideoWidth,
    height: landscapeVideoHeight,
    borderColor: 'gray',
    borderWidth: 1,
  },
  video: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: landscapeVideoWidth,
    height: landscapeVideoHeight,
    borderColor: 'gray',
    borderWidth: 1,
  },
  screen: {
    position: 'absolute',
    top: smallGap,
    left: landscapeVideoWidth,
    width: smallViewWidth,
    height: smallViewHeight,
    borderColor: 'red',
    borderWidth: 1,
  },
  whiteboard1: {
    position: 'absolute',
    top: smallViewHeight + 2*smallGap,
    left: landscapeVideoWidth,
    width: smallViewWidth,
    height: smallViewHeight,
    borderColor: 'gray',
    borderWidth: 1,
  },
  whiteboard2: {
    position: 'absolute',
    top: 2 * smallViewHeight + 3*smallGap,
    left: landscapeVideoWidth,
    width: smallViewWidth,
    height: smallViewHeight,
    borderColor: 'gray',
    borderWidth: 1,
  },
};

function updateLayout(state, action) {
  const newState = Object.assign({}, state);
  const parts = ['control','video', 'screen', 'whiteboard1', 'whiteboard2'];
  parts.forEach(part => {
    if (action.layout[part]) {
      newState[part] = Object.assign({}, action.layout[part]);
    }
  });
  newState.active = action.layout.active;
  return newState;
}
export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LECTURE_LOAD_SUCCESS:
      // if (!action.lecture.whiteboard2) {
      //   return Object.assign({}, state, {
      //     whiteboard2: null,
      //   });
      // }
      return state;
    case ActionTypes.PLAYER_ACTIVATE:
      return Object.assign({}, state, {
        actives: Object.assign([], action.actives),
        fullscreen: action.fullscreen,
      });
    case ActionTypes.PLAYER_RESIZE:
      return Object.assign({}, state, {
        width: action.width,
        height: action.height,
        windowWidth: action.windowWidth,
        windowHeight: action.windowHeight,
      });
    case ActionTypes.SCREENSHOT_RESIZE:
      return Object.assign({}, state, {
        screenWidth: action.width,
        screenHeight: action.height,
        screenRatio: action.height / action.width,
      });
    case ActionTypes.PLAYER_CHANGE_SCREEN_RATIO:
      return Object.assign({}, state, {
        screen: Object.assign({}, state.screen, {
          ratio: action.ratio,
        }),
      });
    case ActionTypes.PLAYER_RELAYOUT:
      return updateLayout(state, action);
    case ActionTypes.PLAYER_ORIENTATION:
      return state;
    case ActionTypes.PLAYER_EXIT:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
}
