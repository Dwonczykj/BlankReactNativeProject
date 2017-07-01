
import {AsyncStorage} from 'react-native';
import _ from 'lodash';
var encoding = require('NativeModules').Encoding;

const authKey = 'auth';
const userKey = 'user';

export const fetchAndIncrementCount = (request, requestCount) => {
  if(requestCount < 50)
  {
    return fetch(request);
  }
  else
  {
    return new Promise((resolve,reject) => {
      resolve();
    })
  }
}

export const getAuthInfo = (cb) => {
    AsyncStorage.multiGet([authKey, userKey], (err, val)=> {
        if(err){
            return cb(err);
        }

        if(!val){
            return cb();
        }

        var zippedObj = _.zipObject([authKey, userKey],[val[0][1],val[1][1]]);

        if(!zippedObj[authKey]){
            return cb();
        }

        var authInfo = {
            header: {
                Authorization: 'Basic ' + zippedObj[authKey]
            },
            user: JSON.parse(zippedObj[userKey])
        }

        return cb(null, authInfo);
    });
};

export const login = (creds, cb) => {
    var authStr = creds.username + ':' + creds.password;
    encoding.base64Encode(authStr, (encodedAuth)=>{
        fetch('https://api.github.com/user',{
            headers: {
                'Authorization' : 'Basic ' + encodedAuth
            }
        })
        .then((response)=> {
            if(response.status >= 200 && response.status < 300){
                return response;
            }

            throw {
                badCredentials: response.status == 401,
                unknownError: response.status != 401
            }
        })
        .then((response)=> {
            return response.json();
        })
        .then((results)=> {
            AsyncStorage.multiSet([
                [authKey, encodedAuth],
                [userKey, JSON.stringify(results)]
            ], (err)=> {
                if(err){
                    debugger;
                    throw err;
                }

                return cb({success: true});
            });
        })
        .catch((err)=> {
            return cb(err);
        });
    });
};
