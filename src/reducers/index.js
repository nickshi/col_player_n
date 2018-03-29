import { combineReducers } from 'redux';
import routes from './routes';
import account from './account';
import courses from './courses';
import lecture from './lecture';
import screen from './screen';
import layout from './layout';
import player from './player';
import localScreen from './localScreen';
import WhiteBoard from './whiteboard';
// ... other reducers

export default combineReducers({
  routes,
  account,
  courses,
  lecture,
  layout,
  screen,
  localScreen,
  player,
  whiteboard1: new WhiteBoard('whiteboard1'),
  whiteboard2: new WhiteBoard('whiteboard2'),
});
