import {Reducer} from 'redux-offline';
import * as types from '../../Actions/actionTypes';
import * as InitialState from './InitialState';
import newGuid from '../../Common/Guid';


export const alarms = (state = InitialState.alarms, action) => {
  switch (action.type) {
    case types.ALARM_ADDED:
        return Object.assign(
          {},
          ...state,
          {[newGuid()]: action.payload.alarm}
        );

    case types.ALARM_ADDED_COMPLETE:
      return state;

    case types.ALARM_CHANGED:
        return Object.assign(
          {},
          ...Object.keys(state).filter(alarmId => alarmId !== action.payload.alarm.id)
            .map(alarmId => {
              return {
                [alarmId]: state[alarmId]
              }
            }),
          {[action.payload.alarm.id]: action.payload.alarm}
        );

    case types.ALARM_CHANGED_ROLLBACK:
        return Object.assign(
          {},
          ...state
        );

    case types.ALARM_DELETED:
        return Object.assign(
          {},
          ...Object.keys(state)
            .filter(alarmId => alarmId !== action.payload.alarmId)
            .map(alarmId => {
              return {
                [alarmId]:state[alarmId]
              };
            })
        );

    case types.ALARM_DELETED_ROLLBACK:
        return Object.assign(
          {},
          ...state
        );

    default:
      return state || {};
  }
}
