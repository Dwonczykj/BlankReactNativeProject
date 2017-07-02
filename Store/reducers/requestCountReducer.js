import {Reducer} from 'redux-offline';
import * as types from '../../Actions/actionTypes';
import * as InitialState from './InitialState';


export const requestCount = (state = InitialState.requestCount, action) => {
  switch (action.type) {
    case types.INCREMENT_REQUEST_COUNT:
        return state+1;

    case types.DECREMENT_REQUEST_COUNT:
        return state-1<1?0:state-1;

    default:
      return state || 0;
  }
}
