import React from 'react';

import {
  DatePickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Heading from './Common/Header';
import MapContainer from './mapContainer';

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      mydate: this.props.date,
      datePickerDate: new Date(),
      dateMode: "datetime",
      alarm1: null,
      ringAlarm: false,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      start: null,
      end: null
    }
    this.addAlarm = this.addAlarm.bind(this);
    this.stopAlarm = this.stopAlarm.bind(this);
    this.setDateMode = this.setDateMode.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.addJourney = this.addJourney.bind(this);
    this.addStartToJourney = this.addStartToJourney.bind(this);
    this.addEndToJourney = this.addEndToJourney.bind(this);
  }

  static defaultProps = {
    date: new Date(),
    timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
  };

  // componentDidMount(){
  //   //TODO: Add this.setInterval so that the Clock stops when the component unmounts.
  //   setInterval( () => {
  //     this.setState({
  //       curTime : new Date().toLocaleString()
  //     })
  //   },1000)
  // }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    if(this.state.alarm1 && Math.abs(this.state.mydate - this.state.alarm1) < 1000)
    {
      return this.setState({
        mydate: new Date(),
        ringAlarm: true
      });
    } else {
      this.setState({
        mydate: new Date(),
      });
    }
  }

  onDateChange = (date) => {
    this.setState({datePickerDate: date});
  };

  onTimezoneChange = (event) => {
    var offset = parseInt(event.nativeEvent.text, 10);
    if (isNaN(offset)) {
      return;
    }
    this.setState({timeZoneOffsetInHours: offset});
  };

  addAlarm(){
    let t = this.state.datePickerDate;
    this.setState({alarm1: t});
    console.log(`alarm added for ${t}`);
  }

  stopAlarm(){
    this.setState({
      ringAlarm: false
    })
  }

  setDateMode(mode){
    if(!(mode === "datetime" || mode === "date" || mode === "time"))
    {
      return;
    }
    this.setState({dateMode: mode});
  }

  addStartToJourney(coordinate){
    // this.props.navigator.pop();
    this.setState({start: coordinate});
  }

  addEndToJourney(coordinate){
    // this.props.navigator.pop();
    this.setState({end: coordinate});
  }

  finishJourneySetUp(){
    this.props.navigator.pop();
  }

  addJourney(){
    this.props.navigator.push({
        title: 'Journey Planner',
        component: MapContainer,
        passProps: {
          onStart: this.addStartToJourney, //use the mapView on Select method.
          onEnd: this.addEndToJourney,
          complete: this.finishJourneySetUp
        }
    });
  }

  render(){
      return (
        <View
          style={styles.container}
        >
          <DatePickerIOS
            date={this.state.datePickerDate}
            mode={this.state.dateMode}
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange}
            style={styles.datePicker}
          />
          <Text style={styles.error}>It is {this.state.mydate.toLocaleString()}.</Text>
          <Text style={styles.error}>Alarm will be set to: {this.state.datePickerDate.toLocaleString()}.</Text>
          <Text style={styles.error}>Alarm @: {this.state.alarm1? this.state.alarm1.toLocaleString(): "not set yet"}.</Text>
          {this.state.ringAlarm && <Text style={styles.error}>Alarm is ringing!!!</Text>}
          <TouchableHighlight
              onPress={this.addAlarm}
              style={styles.button}>
              <Text style={styles.buttonText}>Add Alarm</Text>
          </TouchableHighlight>

          <TouchableHighlight
              onPress={this.stopAlarm}
              style={styles.button}>
              <Text style={styles.buttonText}>Stop Alarm</Text>
          </TouchableHighlight>

          <TouchableHighlight
              onPress={this.addJourney}
              style={styles.button}>
              <Text style={styles.buttonText}>Select Journey</Text>
          </TouchableHighlight>
        </View>
      );
  }
}

let styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        paddingTop: 100,
        padding: 10,
        alignItems: 'center',
        flex: 1
    },
    clock: {
        height: 150,
        width: 150,
        marginTop: 10,
        padding: 4,
        borderWidth: 1,
        backgroundColor: '#F5FCFF',
        borderColor: '#48BBEC',
        borderRadius: 0,
    },
    datePicker: {
      backgroundColor: '#F5FCFF',
      height: 150,
      width: 500,
      marginTop: 10,
      marginBottom: 40
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 24
    },
    loader: {
        marginTop: 20
    },
    error: {
        color: 'red',
        paddingTop: 10
    }
});
