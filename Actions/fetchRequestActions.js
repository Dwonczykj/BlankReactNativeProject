import * as types from './actionTypes';
// import * as apiTypes from '../api/apiTypes';
import Geocoder from 'react-native-geocoder';


Geocoder.fallbackToGoogle("AIzaSyD66bZZp986PADV5Epxe1eU6HJ0li2iq-c");

const fetchRequestActions = (dispatch) => {

  const fetchRequest = (request) => {
    dispatch({type: types.EXTERNAL_FETCH_REQUEST, data: request})
  }

  const geocodePosition = (coordinate) => {
    dispatch({type: types.INCREMENT_REQUEST_COUNT});
    return Geocoder.geocodePosition(coordinate);
  }

  const geocodeAddress = (stringAddress) => {
    throw new Exception("This is not implemented.");
    // dispatch({type: types.INCREMENT_REQUEST_COUNT});
  }

  return {
    fetchRequest: fetchRequest,
    geocodePosition: geocodePosition
  };
};

export default fetchRequestActions;

// export class myGeocoder {
//   constructor(dispatch)
//   {
//       this.dispatch = dispatch
//   }
//
//
// }
