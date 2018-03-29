import * as ActionTypes from '../constants/ActionTypes';
import createReducer from '../utils/create-reducer';
const initState = {
  lectures: {},
  loading: false,
  error: '',
  isInitialized: false,
  selectedCourseName: '',
};

const actionHandler = {
  [ActionTypes.COURSES_FETCH]: (state, action) => (
    Object.assign({}, state, {
      error: '',
      loading: true,
    })
  ),

  [ActionTypes.COURSES_FETCH_SUCCESS]: (state, action) => (
    Object.assign({}, state, {
      lectures: action.lectures,
      isInitialized: true,
      loading: false,
      error: '',
    })
  ),

  [ActionTypes.COURSES_FETCH_ERROR]: (state, action) => (
    Object.assign({}, state, {
      error: action.error,
      loading: false,
    })
  ),

  [ActionTypes.COURSES_SELECT]: (state, action) => (
    Object.assign({}, state, {
      selectedCourseName: action.selectedCourseName,
    })
  ),
  [ActionTypes.LECTURE_DOWNLOAD_START]: (state, action) => (
    {
      ...state,
      lectures: {
        ...state.lectures,
        [action.lectureId]: {
          ...state.lectures[action.lectureId],
          state:'downloading',

        }
      }
    }
  ),
  [ActionTypes.LECTURE_DOWNLOAD_END]: (state, action) => (
    {
      ...state,
      lectures: {
        ...state.lectures,
        [action.lectureId]: {
          ...state.lectures[action.lectureId],
          state:'downloaded',
        }
      }
    }
  ),
    [ActionTypes.LECTURE_CLEAR_SUCCESS]: (state, action) => (
    {
      ...state,
      lectures: {
        ...state.lectures,
        [action.lectureId]: {
          ...state.lectures[action.lectureId],
          state:'pending',
          screendatadownloaded: 0,
          screenindexdownloaded: 0,
          videodownloaded: 0,
          wb1datadownloaded: 0,
          wb1indexdownloaded: 0,
          wb2datadownloaded: 0,
          wb2indexdownloaded: 0,
        }
      }
    }
  ),
  [ActionTypes.LECTURE_DOWNLOAD_PROGRESS]: (state, action) => (
    {
      ...state,
      lectures: {
        ...state.lectures,
        [action.lectureId]: {
          ...state.lectures[action.lectureId],
          [action.name + 'downloaded']:action.receivedSize,

        }
      }
    }
  ),
  [ActionTypes.ACCOUNT_LOGOUT]: (state, action) => (
    initState
  ),
};

export default createReducer(initState, actionHandler);
