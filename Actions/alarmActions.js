import * as types from './actionTypes';
// import * as apiTypes from '../api/apiTypes';

const alarmsActions = (dispatch) => {

  const addAlarm = ( newalarm ) => {
    return dispatch({
      type: types.ALARM_ADDED,
      payload: { newalarm },
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
    deleteAlarm: deleteAlarm
  };
};

export default alarmsActions;
