import * as types from './actionTypes';
// import * as apiTypes from '../api/apiTypes';

const alarmsActions = (dispatch) => {

  const addAlarm = ( alarm ) => {
    return dispatch({
      type: types.ALARM_ADDED,
      payload: { alarm },
      meta: {
        offline: {
          // the network action to execute:
          effect: { url: '', method: 'POST', body: { id: newalarm.id } },
          // action to dispatch when effect succeeds:
          commit: { type: types.ALARM_ADDED_COMPLETE, meta: { } },
          // action to dispatch if network action fails permanently:
          rollback: { type: types.ALARM_ADDED_ROLLBACK, meta: { id: newalarm.id }}
         }
      }
    });
  };

  const editAlarm = (alarm ) => {
    return dispatch({
      type: types.ALARM_CHANGED,
      payload: { alarm },
      meta: {
        offline: {
          // the network action to execute:
          effect: { url: '', method: 'POST', body: { id: alarm.id } },
          // action to dispatch when effect succeeds:
          commit: { type: types.ALARM_CHANGED_COMPLETE, meta: { } },
          // action to dispatch if network action fails permanently:
          rollback: { type: types.ALARM_CHANGED_ROLLBACK, meta: { } }
         }
      }
    });
  }

  // const editAlarmNative = (alarm, nativecallback) => {
  //   let nativeResult = nativecallback(alarm);
  //   debugger;
  //   if(nativeResult){
  //     return dispatch({
  //       type: types.ALARM_CHANGED,
  //       payload: { alarm },
  //       meta: {
  //         offline: {
  //           // the network action to execute:
  //           effect: { url: '', method: 'POST', body: { id: alarm.id } },
  //           // action to dispatch when effect succeeds:
  //           commit: { type: types.ALARM_CHANGED_COMPLETE, meta: { } },
  //           // action to dispatch if network action fails permanently:
  //           rollback: { type: types.ALARM_CHANGED_ROLLBACK, meta: { } }
  //          }
  //       }
  //     });
  //   }
  //   return;
  // }

  const editAlarmNativeCallBack = (alarmArr) => {
    console.log(alarmArr);
    if(alarmArr)
    {
        let nativeResultAlarm = alarmArr;
        nativeResultAlarm.time = new Date(nativeResultAlarm.time);
        editAlarm(alarmArr);
    }
    else {
      return dispatch({
        type: types.NATIVE_ALARM_ADD_FAILED,        
        meta: {
          offline: {
            // the network action to execute:
            effect: { url: '', method: 'POST', body: {  } },
            // action to dispatch when effect succeeds:
            // commit: { type: types.NATIVE_ALARM_ADD_FAILED, meta: { } },
            // action to dispatch if network action fails permanently:
            // rollback: { type: types.ALARM_DELETED_ROLLBACK, meta: { alarmId }}
           }
        }
      })
    }
    return;
  };

  const deleteAlarm = (alarmId) => {
    return dispatch({
      type: types.ALARM_DELETED,
      payload: { alarmId },
      meta: {
        offline: {
          // the network action to execute:
          effect: { url: '', method: 'POST', body: { id: alarmId } },
          // action to dispatch when effect succeeds:
          commit: { type: types.ALARM_DELETED_COMPLETE, meta: { } },
          // action to dispatch if network action fails permanently:
          rollback: { type: types.ALARM_DELETED_ROLLBACK, meta: { alarmId }}
         }
      }
    });
  }

  return {
    addAlarm: addAlarm,
    editAlarm: editAlarm,
    // editAlarmNative: editAlarmNative,
    editAlarmNativeCallBack: editAlarmNativeCallBack,
    deleteAlarm: deleteAlarm
  };
};

export default alarmsActions;
