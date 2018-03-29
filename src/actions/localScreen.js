import * as ActionTypes from '../constants/ActionTypes';
import Col from '../lib/col/Col';

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

export function screenTimeUpdate(currentTime = 0) {
  return async (dispatch, getState) => {
    const storeState = getState();
    const state = storeState.localScreen;
    const screen = storeState.lecture.screen;
    const second = Math.floor(currentTime);
    if (second === state.second) {
      dispatch({
        type: ActionTypes.SCREENSHOT_TIMEUPDATE_LOCAL,
        state,
      });
      return;
    }

    const frameIndex = indexOf(screen.seconds, second);

    if (frameIndex === state.lastDrewIndex) {
      dispatch({
        type: ActionTypes.SCREENSHOT_TIMEUPDATE_LOCAL,
        state,
      });
      return;
    }

    const frame = screen.frames[frameIndex];
    function loadTile(idx, aTiles) {
      let tile = aTiles[idx];
      return Col.loadTileData(
          storeState.lecture.lectureInfo.screendatafilepath,
          tile.offset,
          tile.length
        ).then(data => {
        tiles[idx] = data;
      });
    }

    let tiles = {};
    let queue = [];
    Object.keys(frame.tiles).forEach(idx=> {
      queue.push(loadTile(idx, frame.tiles));
    });

    Promise.all(queue).then(()=>{
      let dirtyFrame = {};
      dirtyFrame.tiles = tiles;
      dispatch(
        {
          type: ActionTypes.SCREENSHOT_TIMEUPDATE_LOCAL,
          state: Object.assign({}, state, {
            second,
            index: frameIndex,
            lastDrewIndex: frameIndex,
            dirtyFrame,
          }),
        });

    }).catch(err => {
      console.log('err ', err.stack);
    });
    
  };
}
