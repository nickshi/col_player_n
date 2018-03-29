import * as ActionTypes from '../constants/ActionTypes';
import NetworkHelper from '../utils/NetworkHelper';
import Util from '../utils/Util';
import async from 'async';

function fetchCourses() {
  return {
    type: ActionTypes.COURSES_FETCH,
    loading: true,
  };
}

function downloadStart(lectureId) {
  return {
      type: ActionTypes.LECTURE_DOWNLOAD_START,
      lectureId,
    };
}

function downloadEnd(lectureId) {
  return {
      type: ActionTypes.LECTURE_DOWNLOAD_END,
      lectureId,
    };
}

function downloadProgress(lectureId, name, receivedSize, totalSize) {
  return {
      type: ActionTypes.LECTURE_DOWNLOAD_PROGRESS,
      lectureId,
      name,
      receivedSize,
      totalSize,
    };
}

function fetchSuccess(lectures, curCourseName) {
  return {
    type: ActionTypes.COURSES_FETCH_SUCCESS,
    lectures,
    selectedCourseName: curCourseName,
  };
}

function fetchError(error) {
  return {
    type: ActionTypes.COURSES_FETCH_ERROR,
    error,
  };
}

function fetchLoading(loading) {
  return {
    type: ActionTypes.COURSES_FETCH_LOADING,
    loading,
  };
}

function courseSelect(selectedCourseName) {
  return {
    type: ActionTypes.COURSES_SELECT,
    selectedCourseName,
  };
}

function loadCourses() {
  return (dispatch) => {
    dispatch(fetchCourses());
    NetworkHelper.loadCourses((err, lectures, courseName) => {
      if (err) {
        dispatch(fetchError(err.detail));
      } else {
        dispatch(fetchSuccess(lectures, courseName));
      }
    });
  };
}

function downloadLecture(lecture) {
  return async (dispatch) => {
    dispatch(downloadStart(lecture.id));
    var lecturePath = await Util.getLectureDir(lecture.id);
    async function downloadFile(name, filename) {
      var filepath = lecturePath + '/' + filename;

      return NetworkHelper.downloadLecture(lecture[name], filepath, lecture[name+'downloaded'], (receivedSize, totalSize) => {
        receivedSize = parseInt(receivedSize, 10);
        totalSize = parseInt(totalSize, 10);
        dispatch(downloadProgress(lecture.id, name, receivedSize, totalSize));
      });
    }


    async function getAllNeedDownloads() {
      const fileData = [
      {
        name:'wb1index',
        filename:'wb1index.pak'
      },
      {
        name:'wb1data',
        filename:'wb1data.pak'
      },
      {
        name:'wb2index',
        filename:'wb2index.pak'
      },
      {
        name:'wb2data',
        filename:'wb2data.pak'
      },

      {
        name:'screenindex',
        filename:'screenindex.pak'
      },
      {
        name:'screendata',
        filename:'screendata.pak'
      },
      {
        name:'video',
        filename:'video.mp4'
      }
      ];
      let files = [];
      const lectureDir = await Util.getLectureDir(lecture.id);

      for (i = 0; i < fileData.length; i++) { 
        file = fileData[i];
        const desFilePath = lectureDir + '/' + file.filename;
        const isDesExist = await Util.isFileExist(desFilePath);
        if (!isDesExist && lecture[`${file.name}size`] !== 0) {

          files.push(file);
        }
      }
      
      return files;

    }
    const needDownloads = await getAllNeedDownloads();
    
    // try {
    //   for(let file of needDownloads) {
    //     await downloadFile(next.name, next.filename);
    //   }
    //   dispatch(downloadEnd(lecture.id));
    // } 
    // catch(err) {
    //   dispatch(downloadEnd(lecture.id));
    // }

    needDownloads.reduce(function(cur, next) {
      return cur.then(function() {
        return downloadFile(next.name, next.filename);
      });
    }, Promise.resolve())
    .then(results=> {
      dispatch(downloadEnd(lecture.id));
    })
    .catch(error => {
      console.log('error ', error);
      dispatch(downloadEnd(lecture.id));
    });
  };
}

export default {
  courseSelect,
  loadCourses,
  downloadLecture,
};
