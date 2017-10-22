import {Reducer} from 'redux-offline';
import * as types from '../../Actions/actionTypes';
import * as InitialState from './InitialState';
import newGuid from '../../Common/Guid';

import stringifyObject from 'stringify-object';


export const alarms = (state = InitialState.alarms, action) => {
  console.warn(action.type + " action reduced");
  switch (action.type) {
    case "persist/REHYDRATE":
      console.warn(stringifyObject(action.payload, {
          indent: '  ',
          singleQuotes: false
        })
      );
      console.log(action.payload);

      // if(false){//action.payload.alarms){
      //   return Object.assign(
      //     {},
      //     state || {},
      //     ...Object.keys(action.payload.alarms).filter(alarmId => !Object.keys(state).includes(alarmId)).map(alarmId => action.payload.alarms[alarmId])
      //   );
      // }else{
        return state;
      // }

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
          {[action.payload.alarm.id]: action.payload.alarm/*.time instanceof Date?
            action.payload.alarm :
            Object.keys(action.payload.alarm).reduce((acc,key)=>{
              key === "time"?
              acc[key] = new Date(action.payload.alarm[key]) :
              acc[key] = action.payload.alarm[key]
              return acc;
            },{})*/
          }
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
