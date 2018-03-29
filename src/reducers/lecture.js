import * as ActionTypes from '../constants/ActionTypes';
import createReducer from '../utils/create-reducer';

const colors = ['red', 'blue', 'green', 'brown', 'orange', 'purple', 'yellow', 'black'];

const initState = {
  lectureInfo: null,
  initialized: false,
  baseUrl: null,
  hlsUrl: null,
  videoUrl: null,
  error: null,
  loading: false,
  screen: null,
  whiteboard1: null,
  whiteboard2: null,
  local: false,
};

function createScreen(blockList, baseUrl) {
  const seconds = [];
  const frames = [];
  let blockIndex = 0;
  if (blockList.length === 0) {
    console.error('Invalid screen blocks');
  }
  const blocks = blockList.map(block => {
    let index = 0;
    let start = 0;
    let end = 0;
    let frame = null;
    const imageUrl = `${baseUrl}/screens/${block.imageName}`;
    if (!block.imageName || !block.imageName.length) {
      console.error('A block should has an imageName property');
    }

    if (!block.tiles || !block.tiles.length) {
      console.error('A block should has a tils list');
    }

    function addFrame(second, previousFrame) {
      if (!start) {
        start = second;
      }
      if (second > end) {
        end = second;
      }
      seconds.push(second);
      const tiles = previousFrame ? Object.assign({}, previousFrame.tiles) : {};
      const f = {
        blockIndex,
        imageUrl,
        second,
        tiles,
        tileWidth: block.tileWidth,
        tileHeight: block.tileHeight,
      };
      frames.push(f);
      return f;
    }

    block.tiles.forEach(tile => {
      const second = tile[0];
      if (tile.length === 1) {
        frame = addFrame(second);
        for (let i = 0; i < 64; i++) {
          frame.tiles[i] = index++;
        }
      } else if (tile.length === 3) {
        frame = addFrame(second, frame);
        index = tile[2];
        frame.tiles[tile[1]] = index++;
      } else if (frame) {
        index = tile[1];
        frame.tiles[tile[0]] = index++;
      }
    });

    blockIndex++;

    return {
      imageUrl,
      start,
      end,
    };
  });

  return {
    seconds,
    blocks,
    frames,
  };
}

function createPoint(ms, x, y) {
  return {
    millisecond: ms,
    x,
    y,
  };
}

function createWhiteboard(blockList) {
  if (!blockList || !blockList.length) {
    return null;
  }

  let blockIndex = 0;
  const milliseconds = [];

  const blocks = blockList.map(block => {
    const points = [];
    const frames = [];
    let frame = null;
    let start = 0;
    let end = 0;

    if (!block.points || !block.points.length) {
      console.error('A block should has a points list');
    }

    function addFrame(millisecond) {
      if (!start) {
        start = millisecond;
      }
      if (end < millisecond) {
        end = millisecond;
      }

      milliseconds.push(millisecond);
      const f = {
        blockIndex,
        millisecond,
        start: points.length,
        end: points.length,
      };
      frames.push(f);
      return f;
    }

    block.points.forEach(arr => {
      if (arr.length === 3) {
        const ms = arr[0];
        frame = addFrame(ms, frame);
        points.push(createPoint(ms, arr[1], arr[2]));
      } else if (arr.length === 2) {
        if (arr[1] < 0) {
          const ms = arr[0];
          frame = addFrame(ms, frame);
          points.push(createPoint(ms, arr[1], 0));
        } else if (frame) {
          frame.end = points.length;
          points.push(createPoint(frame.millisecond, arr[0], arr[1]));
        }
      } else if (arr.length === 1 && frame) {
        frame.end = points.length;
        points.push(createPoint(frame.millisecond, arr[0], 0));
      }
    });
    blockIndex++;
    return {
      start,
      end,
      points,
      frames,
    };
  });
  if (!milliseconds.length) {
    return null;
  }

  return {
    blockIndex,
    milliseconds,
    blocks,
  };
}

const lectureAction = {
  [ActionTypes.LECTURE_LOADING]: (state, action) => (
    Object.assign({}, state, {
      error: null,
      loading: true,
    })
  ),

  [ActionTypes.LECTURE_LOAD_FAILURE]: (state, action) => (
    Object.assign({}, state, {
      error: action.error,
      loading: false,
    })
  ),

  [ActionTypes.LECTURE_LOAD_SUCCESS]: (state, action) => {
    const { local } = action;
    if (local === false) {
      const { lecture, lectureInfo, account, baseUrl } = action;
      if (!lecture) {
        return state;
      }
      let videoUrl = `${lectureInfo.video}?u=${account.username}&k=${account.token}`;
      //videoUrl = baseUrl + '/hls1/index.m3u8';
      
      return Object.assign({}, state, {
        local,
        lectureInfo,
        baseUrl,
        videoUrl,
        initialized: true,
        hlsUrl: lecture.hlsUrl,
        error: null,
        loading: false,
        screen: createScreen(lecture.screen, baseUrl),
        whiteboard1: createWhiteboard(lecture.whiteboard1),
        whiteboard2: createWhiteboard(lecture.whiteboard2),
      });
    }
    const { lectureInfo, baseUrl, screen, whiteboard1, whiteboard2 } = action;
    return Object.assign({}, state, {
      local,
      lectureInfo,
      baseUrl,
      screen,
      whiteboard1,
      whiteboard2,
      videoUrl: lectureInfo.videofilepath,
      initialized: true,
      error: null,
      loading: false,
    });
  },
  [ActionTypes.PLAYER_EXIT]: (state) => {
    return Object.assign({}, state, {
      initialized: false,
    });
  },
};
export default createReducer(initState, lectureAction);
