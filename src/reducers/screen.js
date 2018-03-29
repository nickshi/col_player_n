import * as ActionTypes from '../constants/ActionTypes';

const initState = {
  downloading: false,
  error: null,
  lastDrewIndex: -1,
  second: -1,
  index: -1,
  dirtyFrame: null,
  cachedImages: {},
  retryCounter: {},
};

function indexOf(seconds, second) {
  if (seconds.lenght === 0 || second < seconds[0]) {
    return 0;
  }
  for (let i = 0; i < seconds.length; i++) {
    if (second === seconds[i]) {
      return i;
    }

    if (second < seconds[i]) {
      return i > 0 ? i - 1 : 0;
    }
  }
  return 0;
}

function update(state, action) {
  const screen = action.state.lecture.screen;
  const second = Math.floor(action.currentTime);
  if (second === state.second) {
    return state;
  }

  const frameIndex = indexOf(screen.seconds, second);
  if (frameIndex === state.lastDrewIndex) {
    return Object.assign({}, state, {
      second,
    });
  }
  const frame = screen.frames[frameIndex];
  return Object.assign({}, state, {
    second,
    index: frameIndex,
    dirtyFrame: frame,
    cachedImages: removeExpiredImages(state, frame),
  });
}

function setRetryCount(state, blockIndex, reset) {
  const retryCounter = Object.assign({}, state.retryCounter);
  if (reset) {
    retryCounter[blockIndex] = 0;
  } else {
    if (retryCounter[blockIndex] > 0) {
      retryCounter[blockIndex]++;
    } else {
      retryCounter[blockIndex] = 1;
    }
  }
  return retryCounter;
}

// 图片下载失败，计数器纪录失败次数
function downloadFailure(state, action) {
  let retryCounter = state.retryCounter;
  if (action.blockIndex >= 0) {
    retryCounter = setRetryCount(state, action.blockIndex, false);
  }
  return Object.assign({}, state, {
    error: action.error,
    downloading: false,
    retryCounter,
  });
}

function removeExpiredImages(state, frame) {
  // check expired cached images
  const images = Object.assign({}, state.cachedImages);
  const toberemovedKeys = [];

  Object.keys(images).forEach(key => {
    const blockIndex = parseInt(key, 10);
    // remove all cached previous frames images
    if (blockIndex < frame.blockIndex) {
      toberemovedKeys.push(key);
    }
  });

  toberemovedKeys.forEach(key => {
    delete images[key];
  });
  return images;
}

function cache(state, action) {
  const { blockIndex, img } = action;
  const images = Object.assign({}, state.cachedImages);
  images[blockIndex] = img;
  return images;
}

export default function (state = initState, action) {
  switch (action.type) {
    case ActionTypes.SCREENSHOT_TIMEUPDATE_ONLINE:
      return update(state, action);
    case ActionTypes.SCREENSHOT_DOWNLOADING:
      return Object.assign({}, state, {
        error: null,
        downloading: true,
      });
    case ActionTypes.SCREENSHOT_DOWNLOAD_FAILURE:
      return downloadFailure(state, action);
    case ActionTypes.SCREENSHOT_PREDOWNLOAD_SUCCESS:
      return Object.assign({}, state, {
        cachedImages: cache(state, action),
        retryCounter: setRetryCount(state, action.blockIndex, true),
      });
    case ActionTypes.SCREENSHOT_DOWNLOAD_SUCCESS:
      return Object.assign({}, state, {
        error: null,
        downloading: false,
        cachedImages: cache(state, action),
        retryCounter: setRetryCount(state, action.blockIndex, true),
      });
    case ActionTypes.SCREENSHOT_DRAWING:
      return Object.assign({}, state, {
        drawing: true,
      });
    case ActionTypes.SCREENSHOT_DRAW_SUCCESS:
      return Object.assign({}, state, {
        drawing: false,
        width: action.width,
        height: action.height,
        lastDrewIndex: action.index,
        dirtyFrame: [],
      });
    case ActionTypes.PLAYER_EXIT:
      return initState;
    case ActionTypes.ACCOUNT_LOGOUT:
      return initState;
    case ActionTypes.SCREENSHOT_DRAW_FAILURE:
      return state;
    default:
      return state;
  }
}
