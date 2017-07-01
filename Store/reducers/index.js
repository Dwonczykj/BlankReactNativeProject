import {alarms} from './alarmsReducer';
import {requestCount} from './requestCountReducer';
import {combineReducers} from 'redux';

//Remember that the reducer name must be the same as its name in the initialState
const rootReducer = combineReducers({
  alarms,
  requestCount
});

export default rootReducer;
