import React from 'react';
import {
  Alert,
  FlatList,
  Text,
  View,
  ListView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Switch,
  TouchableHighlight
} from 'react-native';
import JourneyFlatList from './JourneyFlatList';

export default class JourneyListContainer extends React.Component {
  constructor(props){
    super(props);

    this.itemPressed = this.itemPressed.bind(this);
  }

  itemPressed(id){
    const alarm = this.props.alarms[this.props.currentAlarmId];
    const recentJourney = this.props.alarms[id].journey;
    alarm.journey = recentJourney
    this.props.editAlarm(alarm);
    this.props.showArrivalTime();
  }

  render(){
    return (
      <JourneyFlatList
        itemPressed={this.itemPressed}
        alarms={this.props.alarms}
      />
    );
  }
}
