'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  NavigatorIOS
} from 'react-native';

// import Feed from './Feed';
// import Search from './Search';
// import Clock from './ClockContainer';
// import JourneyTimerContainer from './JourneyTimerContainer';
// import MapContainer from './mapContainer';
import Alarm from './AlarmContainer2';

class AppContainer extends Component {
    constructor(props){
        super(props);
    }

    render(){
      return (
        <NavigatorIOS
            style={{
                flex: 1
            }}
            initialRoute={{
                component: Alarm,
                title: 'Geolarm Clock'
            }}
        />
      );
    }
}

var styles = StyleSheet.create({
});

module.exports = AppContainer;
