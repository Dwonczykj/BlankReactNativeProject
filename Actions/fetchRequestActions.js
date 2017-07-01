import * as types from './actionTypes';
// import * as apiTypes from '../api/apiTypes';

const fetchRequestActions = (dispatch) => {

  const fetchRequest = (request) => {
    dispatch({type: types.EXTERNAL_FETCH_REQUEST, data: request})
  }

  return {
    fetchRequest: fetchRequest
  };
};

  export default fetchRequestActions;
