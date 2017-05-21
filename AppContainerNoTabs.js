'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

// import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
// import { offline } from 'redux-offline';
// import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
// import offlineConfig from 'redux-offline/lib/defaults';

// import reducer from './Store/index';
import InitialState from './Store/reducers/InitialState';
import {configureStore} from './Store/configureStore';

// const store = createStore(
//   reducer,
//   InitialState,
//   compose(
//     applyMiddleware(thunk),
//     offline(offlineConfig)
//   )
// );

const store = configureStore(InitialState);

// import Feed from './Feed';
// import Search from './Search';
// import Clock from './ClockContainer';
// import JourneyTimerContainer from './JourneyTimerContainer';
// import MapContainer from './mapContainer';
import Alarm from './AlarmContainerProgression';
import AlarmList from './AlarmList';

class AppContainer extends Component {
    constructor(props){
        super(props);
    }

    _handleNavigationRequest() {
      this.refs.alarmNav.push({
        component: Alarm,
        title: 'Add Alarm',
        passProps: { myProp: 'genius' },
      });
    }

    render(){
      return (
        <Provider store={store}>
          {/*<NavigatorIOS
              style={{
                  flex: 1
              }}
              ref='alarmNav'
              initialRoute={{
                  component: Alarm,
                  title: 'Geolarm Clock'
              }}
          />*/}
          <NavigatorIOS
              style={{
                  flex: 1
              }}
              ref='alarmNav'
              barTintColor='rgba(19, 20, 29, 0.84)'
              tintColor="rgb(244, 161, 65)"
              titleTextColor="rgb(244, 161, 65)"
              initialRoute={{
                  component: AlarmList,
                  title: 'Geolarm Clock',
                  backButtonTitle: "Done",
                  rightButtonTitle: '+',
                  tintColor: "rgb(244, 161, 65)",
                  barTintColor: 'rgba(19, 20, 29, 0.84)',
                  titleTextColor: "rgb(244, 161, 65)",
                  // rightButtonIcon:
                  onRightButtonPress: () => this._handleNavigationRequest(),
              }}
          />
        </Provider>
      );
    }
}

var styles = StyleSheet.create({
});

module.exports = AppContainer;
