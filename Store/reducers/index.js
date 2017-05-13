import {alarms} from './alarmsReducer';
import {combineReducers} from 'redux';

//Remember that the reducer name must be the same as its name in the initialState
const rootReducer = combineReducers({
  alarms
});

export default rootReducer;
