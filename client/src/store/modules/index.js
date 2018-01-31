import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import global from './global';
import friend from './friend';

export default combineReducers({
  global,
  friend
});