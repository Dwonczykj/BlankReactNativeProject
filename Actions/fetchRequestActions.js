import * as types from './actionTypes';
// import * as apiTypes from '../api/apiTypes';
import Geocoder from 'react-native-geocoder';


Geocoder.fallbackToGoogle("AIzaSyD66bZZp986PADV5Epxe1eU6HJ0li2iq-c");

const fetchRequestActions = (dispatch) => {

  const fetchRequest = (request,requestCount=50) => {
    // dispatch({type: types.EXTERNAL_FETCH_REQUEST, data: request})
    if(requestCount<51)
    {
      dispatch({type: types.INCREMENT_REQUEST_COUNT});
      return fetch(request);
    }
    else
    {
      return new Promise((resolve,reject)=>{
        return resolve({
          status: 900
        });
      });
    }
  }

  const geocodePosition = (coordinate,requestCount=50) => {
    if(requestCount<51)
    {
      dispatch({type: types.INCREMENT_REQUEST_COUNT});
      return Geocoder.geocodePosition(coordinate);
    }
    else
    {
      return new Promise((resolve,reject)=>{
        return reject({
          status: 900
        });
      });
    }
  }

  const getCurrentPosition = (navigator,successcb,errorcb) => {
    if(requestCount<51)
    {
      dispatch({type: types.INCREMENT_REQUEST_COUNT});
      return navigator.geolocation.getCurrentPosition(successcb,errorcb);
    }
    else
    {
      return new Promise((resolve,reject)=>{
        return reject({
          status: 900
        });
      });
    }
  }

  const geocodeAddress = (stringAddress) => {
    throw new Exception("This is not implemented.");
    // dispatch({type: types.INCREMENT_REQUEST_COUNT});
  }

  return {
    fetchRequest: fetchRequest,
    geocodePosition: geocodePosition,
    getCurrentPosition: getCurrentPosition
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
