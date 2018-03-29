import * as ActionTypes from '../constants/ActionTypes';
import Util from '../utils/Util';
import RNFetchBlob from 'react-native-fetch-blob-col';
function downloadBlockByIndex(index) {
  return async (dispatch, getState) => {
    const state = getState();

    if (!state.lecture.initialized
      || !state.lecture.screen
      || !state.lecture.screen.frames
      || state.lecture.screen.frames.length <= index) {
      let error = 'UNKNOWN';
      if (!state.lecture.initialized) {
        error = `Lecture has not been initialized ${index}`;
      }
      if (!state.lecture.screen || !state.lecture.screen.frames) {
        error = `Invalid screen data ${index}`;
      }
      if (state.lecture.screen.frames.length <= index) {
        error = `Out of range: ${index}`;
      }
      dispatch({
        type: ActionTypes.SCREENSHOT_DOWNLOAD_FAILURE,
        error,
        blockIndex: index,
      });
      return;
    }
    const documentDir = await Util.getLectureDir(state.lecture.lectureInfo.id);
    const frame = state.lecture.screen.frames[index];
    const blockIndex = frame.blockIndex;
    const block = state.lecture.screen.blocks[blockIndex];
    const pathAry = block.imageUrl.split('/');
    const imageName = pathAry[pathAry.length-1];
    const localFilepath = `${documentDir}/${imageName}`;
    if (state.screen.cachedImages[blockIndex]) {
      dispatch({
        type: ActionTypes.SCREENSHOT_DOWNLOAD_FAILURE,
        error: 'Image had been cached',
        blockIndex,
      });
      return;
    }

    // download block image
    dispatch({
      type: ActionTypes.SCREENSHOT_DOWNLOADING,
    });

    RNFetchBlob.fetch('GET', block.imageUrl)
    .then((res)=> {
      let base64Str = res.base64();
      dispatch({
        type: ActionTypes.SCREENSHOT_DOWNLOAD_SUCCESS,
        blockIndex,
        img: base64Str,
      });
      predownloadNextBlock(dispatch, state, blockIndex);
    })
    .catch((err)=>{
      console.log('ERROR ', err);
    });
  };
}

function predownloadNextBlock(dispatch, state, blockIndex) {
  const nextBlockIndex = blockIndex + 1;

  if (!state.screen.cachedImages[nextBlockIndex] &&
    nextBlockIndex < state.lecture.screen.blocks.length) {
    const nextBlock = state.lecture.screen.blocks[nextBlockIndex];
    dispatch(predownloadBlock(nextBlockIndex, nextBlock.imageUrl));
  }
}

function predownloadBlock(blockIndex, imageUrl) {
  return async (dispatch, getState) => {
    const state = getState();
    const documentDir = await Util.getLectureDir(state.lecture.lectureInfo.id);

    const pathAry = imageUrl.split('/');
    const imageName = pathAry[pathAry.length-1];
    const localFilepath = `${documentDir}/${imageName}`;

    RNFetchBlob.fetch('GET', imageUrl)
    .then((res)=> {
      let base64Str = res.base64();
      dispatch({
        type: ActionTypes.SCREENSHOT_DOWNLOAD_SUCCESS,
        blockIndex,
        img: base64Str,
      });
      if (Object.keys(state.screen.cachedImages).length < 4) {
        predownloadNextBlock(dispatch, state, blockIndex);
      }
    })
    .catch((err)=>{
      console.log('ERROR ', err);
    });
  };
}

export function screenTimeUpdate(currentTime = 0) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.SCREENSHOT_TIMEUPDATE_ONLINE,
      currentTime,
      state: getState(),
    })
  };
}

export function downloadBlock(index) {
  return (dispatch) => {
    dispatch(downloadBlockByIndex(index));
  };
}
