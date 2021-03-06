import { createStore, applyMiddleware, compose, combineReducers, GenericStoreEnhancer } from 'redux';
import thunk from 'redux-thunk';
// import { routerReducer } from 'react-router-redux';
import { offline } from 'redux-offline';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
//redux-offline in readme current DOES NOT SUPPORT reduxImmutableStateInvariant stores.
import { composeWithDevTools } from 'redux-devtools-extension';
import offlineConfig from 'redux-offline/lib/defaults';
import persist from 'redux-offline/lib/defaults/persist'
// import * as Store from './ts/store';
import reducer from './reducers/index';
import {fetchAndIncrementCount} from '../AuthService';
import * as ActionTypes from '../Actions/actionTypes';

function myAPIServiceMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    if (action.type == ActionTypes.EXTERNAL_FETCH_REQUEST) {
      fetchAndIncrementCount(action.data,getState().requestCount)
        .then(result => {
            dispatch({type: ActionTypes.INCREMENT_REQUEST_COUNT});
        });
      // myService.doSomething(getState());
      // myService.doSomethingElse().then(result => dispatch({ type: 'SOMETHING_ELSE', result }))
    }
    return next(action);
  }
}

const APIServiceMiddleware = myAPIServiceMiddleware()
// const store = createStore(reducer, applyMiddleware(serviceMiddleware))

const config = {
  effect: (effect, action) => {
    console.log(`Executing effect for ${action.type}`);
    return MyApi.send(effect)
  }
}

const persistOptions = {} // your persist options

export function configureStore(initialState) {
  let myOLCfg = offlineConfig;
  // myOLCfg.discard = true;
  const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunk,APIServiceMiddleware),
      offline(myOLCfg)
    )
  );
  //Uncomment line below when want to clean the store.
  // persist(store).purge();

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};





// export function configureStore2(initialState) {
//     // Build middleware. These are functions that can process the actions before they reach the store.
//     const windowIfDefined = typeof window === 'undefined' ? null : window as any;
//     // If devTools is installed, connect to it
//     const devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension as () => GenericStoreEnhancer;
//     //const composeEnhancers =
//     //    process.env.NODE_ENV !== 'production' &&
//     //        typeof window === 'object' &&
//     //        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
//     //        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     //            // Specify here name, actionsBlacklist, actionsCreators and other options
//     //        }) : compose;
//     const createStoreWithMiddleware = compose(
//         applyMiddleware(thunk, reduxImmutableStateInvariant()),
//         devToolsExtension ? devToolsExtension() : f => f
//     )(createStore);
//
//     // Combine all reducers and instantiate the app-wide store instance
//     const allReducers = combineReducers(Store.reducers);
//     const store = createStoreWithMiddleware(allReducers, initialState) /*as Redux.Store<Store.ApplicationState>*/;
//
//     // Enable Webpack hot module replacement for reducers
//     if (module.hot) {
//         module.hot.accept('./ts/store', () => {
//             const nextRootReducer = require<typeof Store>('./ts/store');
//             store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
//         });
//     }
//
//     return store;
// }
