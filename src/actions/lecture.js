import * as ActionTypes from '../constants/ActionTypes';
import Col from '../lib/col/Col';
import Util from '../utils/Util';

function loadOnlineLecture(lectureInfo) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.LECTURE_LOADING,
    });

    const strAry = lectureInfo.video.split('/');
    const baseAry = strAry.slice(0, -2);
    let baseUrl = baseAry.join('/');

    const { username, token } = getState().account;
    const url = `${baseUrl}/meta.json?u=${username}&k=${token}`;

    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((responseJson) => {
      dispatch({
        type: ActionTypes.LECTURE_LOAD_SUCCESS,
        lecture: responseJson,
        baseUrl,
        lectureInfo,
        account: getState().account,
        local: false,
      });
    })
    .catch((error) => {
      console.log(error);
      if (error) {
        dispatch({
          type: ActionTypes.LECTURE_LOAD_FAILURE,
          error,
        });
      }
    });
  };
}

function loadLocalLecture(lecture) {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.LECTURE_LOADING,
    });

    function loadWhiteboard1Data() {
      if (lecture['wb1datasize'] == 0) {
        return new Promise(function(resolve, reject) {
          resolve(null);
        });
      } else {
        return Col.parseWhiteboardIndex(lecture.wb1indexfilepath)
          .then(blocks => {
            return Col.parseWhiteboardData(lecture.wb1datafilepath, blocks);
          });
      }
  
    }

    function loadWhiteboard2Data() {
      if (lecture['wb2datasize'] == 0) {
        return new Promise(function(resolve, reject) {
          resolve(null);
        });
      } else {
        return Col.parseWhiteboardIndex(lecture.wb2indexfilepath)
          .then(blocks => {
            return Col.parseWhiteboardData(lecture.wb2datafilepath, blocks);
          });
      }
    }

    function loadScreenIndex() {
      return Col.parseScreenIndex(lecture.screenindexfilepath);
    }

    let queue = [];
    queue.push(loadScreenIndex());
    queue.push(loadWhiteboard1Data());
    queue.push(loadWhiteboard2Data());
    Promise.all(queue).then(values => {
      const strAry = lecture.video.split('/');
      const baseAry = strAry.slice(0, -2);
      const baseUrl = baseAry.join('/');
      const [screen, whiteboard1, whiteboard2] = values;
      
      dispatch({
        type: ActionTypes.LECTURE_LOAD_SUCCESS,
        lectureInfo: lecture,
        screen,
        whiteboard1,
        whiteboard2,
        baseUrl,
        account: getState().account,
        local: true,
      });
      }).catch(error => {
        alert('loadDataError ');
       console.log('loadDataError ', error.stack);
      dispatch({
        type: ActionTypes.LECTURE_LOAD_FAILURE,
        error,
      });
    });
  };
}

function loadLecture(lectureInfo) {
  if (lectureInfo.state === 'downloaded') {
    return loadLocalLecture(lectureInfo);
  }
  return loadOnlineLecture(lectureInfo);
}

function clearLecture(lectureId) {
  return async (dispatch, getState) => {
    dispatch({
        type: ActionTypes.LECTURE_CLEAR,
        lectureId,
    });

    var folderPath = await Util.getLectureDir(lectureId);
    Util.clearFolderData(folderPath).then(()=>{
      dispatch({
        type: ActionTypes.LECTURE_CLEAR_SUCCESS,
        lectureId,
      });
    }).catch(err=> {
      dispatch({
        type: ActionTypes.LECTURE_CLEAR_FAILURE,
        lectureId,
      });
    });
  }
}

export default {
  loadLecture,
  clearLecture,
};
