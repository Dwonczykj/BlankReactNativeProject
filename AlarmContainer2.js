import React from 'react';
import {connect} from 'react-redux';
import {
  ActivityIndicator,
  DatePickerIOS,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import AlarmActions from './Actions/alarmActions';
import Heading from './Common/Header';
import MapContainer from './mapContainer';
import newGuid from './Common/Guid';

class AlarmContainer2 extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showProgress: false,
      mydate: this.props.date,
      datePickerDate: new Date(),
      dateMode: "datetime",
      addingAlarm: false,
      addingArrivalTime: false,
      alarm1: null,
      alarm: this.getInitialAlarm(),
      ringAlarm: false,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      arrivalTime: null,
      start: null,
      end: null,
      journeyTime: "()"
    }
    //TODO: create a binder function which takes an array of functions as the parameter.
    this.addAlarm = this.addAlarm.bind(this);
    this.editAlarm = this.editAlarm.bind(this);
    this.stopAlarm = this.stopAlarm.bind(this);
    this.setDateMode = this.setDateMode.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.addJourney = this.addJourney.bind(this);
    this.addStartToJourney = this.addStartToJourney.bind(this);
    this.addEndToJourney = this.addEndToJourney.bind(this);
    this.finishJourneySetUp = this.finishJourneySetUp.bind(this);
    this.calculateJourneyTime = this.calculateJourneyTime.bind(this);
    this.addArrivalTimeToJourney = this.addArrivalTimeToJourney.bind(this);
    this.startAddingAlarm = this.startAddingAlarm.bind(this);
    this.startAddingJourneyDestTime = this.startAddingJourneyDestTime.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
    this.deleteJourneyTime = this.deleteJourneyTime.bind(this);
  }

  getInitialAlarm(){
    return {
      time: null,
      id: newGuid(),
      journey: {
        destination: null,
        expectedJourneyLength: null,
        journeyStart: null,
      },
      offWhenUpToggle: false,
      enabled: false
    };
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

  startAddingAlarm(){
    this.setState({addingAlarm: true});
  }

  startAddingJourneyDestTime(){
    this.setState({addingArrivalTime: true});
  }

  addAlarm(){
    this.setState({addingAlarm: false});
    let t = this.state.datePickerDate;
    let alarm = this.state.alarm;
    alarm.time = t;
    alarm.enabled = true;

    this.setState({
      alarm1: t,
      alarm: alarm
    });
    this.props.actions.editAlarm(alarm);
    console.log(`alarm added for ${t}`);
  }

  editAlarm(){
    this.setState({addingAlarm: false});
    let t = this.state.datePickerDate;
    let alarm = this.state.alarm;
    alarm.time = t;
    this.setState({
      alarm1: t,
      alarm: alarm
    });
    debugger;
    this.props.actions.editAlarm(alarm);
    console.log(`alarm added for ${t}`);
  }

  deleteAlarm(){
    this.state.alarm.id && this.props.actions.deleteAlarm(this.state.alarm.id)
    this.setState({
      addingAlarm: false,
       alarm1: null,
       alarm: this.getInitialAlarm()
     });
  }

  stopAlarm(){
    this.setState({
      ringAlarm: false,
      alarm1: null
    })
  }

  setDateMode(mode){
    if(!(mode === "datetime" || mode === "date" || mode === "time"))
    {
      return;
    }
    this.setState({dateMode: mode});
  }

  addStartToJourney(location){
    // this.props.navigator.pop();
    let alarm = this.state.alarm;
    alarm.journey.journeyStart = location;
    this.setState({
      start: location.coordinate,
      alarm: alarm
    });
    this.props.actions.editAlarm(alarm);
  }

  setPropOnObject = (object,prop,value) => {
    return Object.assign(
      {},
      Object.keys(object).filter(key => {
        return (
          key !== prop
        );
      }).map(key => {
        return {
          [key]: object[key]
        }
      }),
      {
        [prop]:value
      }
    );
  }

  addEndToJourney(location){
    // this.props.navigator.pop();
    let alarm = this.state.alarm;
    alarm.journey.destination = location;
    this.setState({
      end: location.coordinate,
      alarm: alarm
    });
    this.props.actions.editAlarm(alarm);
  }

  addArrivalTimeToJourney(){
    let alarm = this.state.alarm;
    alarm.journey.journeyTime = this.state.datePickerDate
    this.setState({
      arrivalTime: this.state.datePickerDate,
      addingArrivalTime: false,
      alarm: alarm
     });
    this.props.actions.editAlarm(alarm);
  }

  deleteJourneyTime(){
    let alarm = this.state.alarm;
    alarm.journey.journeyTime = null
    this.setState({
      addingArrivalTime: false,
      arrivalTime: null,
      alarm: alarm
    });
    this.props.actions.editAlarm(alarm);
  }

  finishJourneySetUp(){
    this.calculateJourneyTime();
    this.props.navigator.pop();
  }

  formatISOForURL(isoString)
  {
    return isoString.replace(/:/i, '%3A').replace(/:/i, '%3A');
  }

  calculateJourneyTime(){
    let arrTime = this.state.arrivalTime instanceof Date && this.state.arrivalTime;
    let time = arrTime || new Date();
    if(this.state.start && this.state.end)
    {
      let request = `https://developer.citymapper.com/api/1/traveltime/?startcoord=${this.state.start.latitude},${this.state.start.longitude}&endcoord=${this.state.end.latitude},${this.state.end.longitude}&time=${this.formatISOForURL(time.toISOString())}&time_type=arrival&key=775a1097e1a1565c121e594df7b9387b`;
      this.setState({showProgress: true});

      fetch(request)
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
            this.setState({journeyTime: results["travel_time_minutes"],showProgress:false});
            let alarm =  this.state.alarm;
            alarm.journey.expectedJourneyLength = results["travel_time_minutes"];
            this.props.actions.editAlarm(alarm);
        })
        .catch((err)=> {
          debugger;
            this.setState({showProgress: false, error: err});
            return cb(err);
        });
    }else
    {
      //return start and end not set yet.
      this.setState({journeyTime: "Start and End need to be set!"})
    }
  }

  addJourney(){
    this.props.navigator.push({
        title: 'Journey Planner',
        component: MapContainer,
        passProps: {
          onStart: this.addStartToJourney, //use the mapView on Select method.
          onEnd: this.addEndToJourney,
          complete: this.finishJourneySetUp,
          start: this.state.start,
          end: this.state.end
        }
    });
  }

  //make calc journey button readonly unless jounery params are set.
  render(){
      return (
        <View
          style={styles.container}
        >
        {!this.state.addingArrivalTime && <TouchableHighlight
            onPress={this.state.addingAlarm?this.addAlarm:this.startAddingAlarm}
            style={styles.button}>
            <Text style={styles.buttonText}>{this.state.addingAlarm?"Set Alarm":"Add Alarm"}</Text>
        </TouchableHighlight>}
        {!this.state.addingAlarm && <TouchableHighlight
            onPress={this.state.addingArrivalTime?this.addArrivalTimeToJourney:this.startAddingJourneyDestTime}
            style={styles.button}>
            <Text style={styles.buttonText}>{this.state.addingArrivalTime?"Set Destination Time":"Add Destination Time"}</Text>
        </TouchableHighlight>}
        {this.state.addingAlarm && <TouchableHighlight
            onPress={this.deleteAlarm}
            style={styles.buttondanger}>
            <Text style={styles.buttonText}>Delete Alarm</Text>
        </TouchableHighlight>}
        {this.state.addingArrivalTime && <TouchableHighlight
            onPress={this.deleteJourneyTime}
            style={styles.buttondanger}>
            <Text style={styles.buttonText}>Delete Destination Time</Text>
        </TouchableHighlight>}
          {(this.state.addingAlarm || this.state.addingArrivalTime) && (<DatePickerIOS
            date={this.state.datePickerDate}
            mode={this.state.dateMode}
            timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
            onDateChange={this.onDateChange}
            style={styles.datePicker}
          />)}
          <Text style={styles.error}>Alarm @: {this.state.alarm1? this.state.alarm1.toLocaleString(): "not set yet"}.</Text>
          <Text style={styles.error}>Destination arrival @: {this.state.arrivalTime? this.state.arrivalTime.toLocaleString(): "not set yet"}.</Text>
          <Text style={styles.success}>Expected Journey Length Now: {this.state.journeyTime.toString()} minutes</Text>

          <TouchableHighlight
              onPress={this.addJourney}
              style={styles.button}>
              <Text style={styles.buttonText}>Select Journey</Text>
          </TouchableHighlight>
          <TouchableHighlight
              onPress={this.calculateJourneyTime}
              style={styles.button}>
              <Text style={styles.buttonText}>Recalculate Journey</Text>
          </TouchableHighlight>
          {this.state.alarm.time && <TouchableHighlight
              onPress={() => this.props.navigator.pop()}
              style={styles.buttonSuccess}>
              <Text style={styles.buttonText}>Done</Text>
          </TouchableHighlight>}
          {this.state.showProgress && <ActivityIndicator
              animating={this.state.showProgress}
              size="large"
              style={styles.loader}
              />}
        </View>
      );
  }
}

const mapStateToProps = (store) =>
{
  return {
    state: store.alarms
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: AlarmActions(dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlarmContainer2);

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
    buttondanger: {
      height: 50,
      backgroundColor: '#ec4874',
      borderColor: '#48BBEC',
      alignSelf: 'stretch',
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5
    },
    buttonSuccess: {
      height: 50,
      backgroundColor: '#48ec80',
      borderColor: '#020608',
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
    },
    success: {
        color: 'green',
        paddingTop: 10
    },
});
