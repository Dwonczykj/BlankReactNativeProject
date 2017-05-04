'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TabBarIOS,
  NavigatorIOS
} from 'react-native';

import Feed from './Feed';
import Search from './Search';
import Clock from './ClockContainer';
import JourneyTimerContainer from './JourneyTimerContainer';
import MapContainer from './mapContainer';
import Alarm from './AlarmContainer';

class AppContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            selectedTab: 'Geolarm Clock'
        }
    }

    render(){
      return (
        <TabBarIOS style={styles.container}>
            <TabBarIOS.Item
                title="Geolarm Clock"
                selected={this.state.selectedTab == 'Geolarm Clock'}
                icon={require('./img/inbox.png')}
                onPress={()=> this.setState({selectedTab: 'Geolarm Clock'})}
            >
                <NavigatorIOS
                    style={{
                        flex: 1
                    }}
                    initialRoute={{
                        component: Alarm,
                        title: 'Geolarm Clock'
                    }}
                />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Map"
                selected={this.state.selectedTab == 'map'}
                icon={require('./img/search.png')}
                onPress={()=> this.setState({selectedTab: 'map'})}
            >
                <NavigatorIOS
                    style={{
                        flex: 1
                    }}
                    initialRoute={{
                        component: MapContainer,
                        title: 'Map'
                    }}
                />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Clock"
                selected={this.state.selectedTab == 'clock'}
                icon={require('./img/search.png')}
                onPress={()=> this.setState({selectedTab: 'clock'})}
            >
                <NavigatorIOS
                    style={{
                        flex: 1
                    }}
                    initialRoute={{
                        component: Clock,
                        title: 'Clock'
                    }}
                />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Journey"
                selected={this.state.selectedTab == 'journey'}
                icon={require('./img/search.png')}
                onPress={()=> this.setState({selectedTab: 'journey'})}
            >
                <NavigatorIOS
                    style={{
                        flex: 1
                    }}
                    initialRoute={{
                        component: JourneyTimerContainer,
                        title: 'Journey Timer'
                    }}
                />
            </TabBarIOS.Item>
        </TabBarIOS>
      );
    }
}

var styles = StyleSheet.create({
});

module.exports = AppContainer;
