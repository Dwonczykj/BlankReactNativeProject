import React from 'react';
import {connect} from 'react-redux';
import {
  ActivityIndicator,
  DatePickerIOS,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import AlarmActions from './Actions/alarmActions';
import Heading from './Common/Header';
import MapContainer from './mapContainer';
import newGuid from './Common/Guid';
import JourneyListContainer from './JourneyListContainer';
import APIActions from './Actions/fetchRequestActions';
import * as globals from './Common/globals';

class AlarmContainerWizard extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      showProgress: false,
      mydate: this.props.date,
      datePickerDate: new Date(),
      dateMode: "datetime",
      addingAlarm: true,
      addingArrivalTime: false,
      showSummary: false,
      alarm1: null,
      alarm: this.getInitialAlarm(),
      currentAlarmId: null,
      ringAlarm: false,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      arrivalTime: null,
      start: null,
      end: null,
      journeyTime: "()"
    }

    //TODO: create a binder function which takes an array of functions as the parameter.
    this.addAlarm = this.addAlarm.bind(this);
    this.addAlarmNoJourney = this.addAlarmNoJourney.bind(this);
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
    // this.startAddingAlarm = this.startAddingAlarm.bind(this);
    // this.startAddingJourneyDestTime = this.startAddingJourneyDestTime.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
    this.deleteJourneyTime = this.deleteJourneyTime.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.showSummary = this.showSummary.bind(this);
  }

  getInitialAlarm(){
    return {
      time: null,
      id: newGuid(),
      journey: {
        destination: null,
        expectedJourneyLength: null,
        journeyStart: null,
        lunchMarkers: null
      },
      journeyType: "transit",
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
    this.setState({currentAlarmId: this.state.alarm.id});
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
    this.setState({datePickerDate: date}, () => {
      if(this.state.addingAlarm)
      {
        this.addAlarmNoJourney(date);
      }
      else if(this.state.addingArrivalTime)
      {
        this.addArrivalTimeToJourney(date);
      }
    });

  };

  onTimezoneChange = (event) => {
    var offset = parseInt(event.nativeEvent.text, 10);
    if (isNaN(offset)) {
      return;
    }
    this.setState({timeZoneOffsetInHours: offset});
  };

  // startAddingAlarm(){
  //   this.setState({addingAlarm: true},() => this.onDateChange(this.state.datePickerDate));
  // }

  // startAddingJourneyDestTime(){
  //   this.setState({addingArrivalTime: true},() => this.onDateChange(this.state.datePickerDate));
  //
  // }

  addAlarm(){
    let t = this.state.datePickerDate;
    let alarm = this.state.alarm;
    alarm.time = t;
    alarm.enabled = true;

    let recentJourneyCount = Object.values(this.props.state).map(alarm => alarm.journey.destination!==null?1:0).reduce((pv, cv) => pv+cv, 0);
    if(recentJourneyCount===0)
    {
      this.addJourney(alarm);
      this.setState({
        addingArrivalTime: false,
        alarm1: t,
        alarm: alarm
      });
    }
    else {
      this.setState({
        addingAlarm:false,
        addingArrivalTime: false,
        alarm1: t,
        alarm: alarm
      });
    }
    this.props.actions.editAlarm(alarm);
    console.log(`alarm added for ${t}`);
  }

  addAlarmNoJourney(date){
    let t = date;
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

  addArrivalTimeToJourney(date){
    let alarm = this.state.alarm;
    alarm.journey.journeyTime = this.state.datePickerDate
    this.setState({
      arrivalTime: date,
      alarm: alarm
     });
    this.props.actions.editAlarm(alarm);
  }

  showSummary(){
    this.setState({
      addingArrivalTime: false,
      showSummary: true,
     });
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
    // this.setState({showSummary: true});
    const currentAlarmDate = this.state.alarm.time || new Date.now().setHours(9).setMinutes(0).setSeconds(0).setMilliseconds(0);
    const journeyTime = this.state.alarm.journey.expectedJourneyLength || 15;
    const noOfMinsToAdd = 30 + journeyTime;
    const newDateObj = new Date(currentAlarmDate.getTime() + noOfMinsToAdd*60000);
    this.setState({
      addingAlarm: false,
      addingArrivalTime: true,
      datePickerDate: newDateObj},() => this.onDateChange(this.state.datePickerDate));
    this.props.navigator.pop();
  }

  formatISOForURL(isoString)
  {
    return isoString.replace(/:/i, '%3A').replace(/:/i, '%3A');
  }

  changeJourneyType(journeyType)
  {
    let alarm = this.props.state[this.state.currentAlarmId];
    alarm.journeyType = journeyType;
    this.props.actions.editAlarm(alarm);
    this.calculateJourneyTime(journeyType);
  }

  calculateJourneyTime(journeyType="transit"){
    let arrTime = this.state.arrivalTime instanceof Date && this.state.arrivalTime;
    let time = arrTime || new Date();
    if(this.state.start && this.state.end)
    {
      let request = `https://maps.googleapis.com/maps/api/directions/json?`;
      request += `origin=${this.state.start.latitude},${this.state.start.longitude}`
      request += `&destination=${this.state.end.latitude},${this.state.end.longitude}`
      request += `&arrival_time=1343641500`
      request += `&key=${globals.mapsAPIKey}`;

      if(journeyType==="transit")
      {
        request = `https://developer.citymapper.com/api/1/traveltime/?`;
        request += `startcoord=${this.state.start.latitude},${this.state.start.longitude}`
        request += `&endcoord=${this.state.end.latitude},${this.state.end.longitude}`
        request += `&time=${this.formatISOForURL(time.toISOString())}`
        request += `&time_type=arrival`
        request += `&key=${globals.citymapperAPIKey}`;
        this.setState({showProgress: true});

        this.props.apiActions.fetchRequest(request)
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
            //TODO: show user that we couldnt calculate the journey time.
              this.setState({showProgress: false, error: err});
              return console.log(err);
          });
      }
      else
      {
        if(journeyType==="car")
        {
          request += "&mode=driving";
        }
        else if(journeyType==="cycle")
        {
          request += "&mode=bicylcing";
        }
        else if(journeyType==="walk")
        {
          request += "&mode=walking";
        }
        this.props.apiActions.fetchRequest(request)
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
              if(results.routes.length === 0)
              {
                throw {
                  message: "no routes returned",
                  status: results.status,
                  error: results.error_message
                }
              }
              let durationarray = results.routes.map(route => route.legs.map(leg => leg.duration.value).reduce((pv,cv)=> pv+cv,0));
              let duration = Math.min(...durationarray);
              this.setState({journeyTime: this.convertSecsToMins(duration),showProgress:false});
              let alarm =  this.state.alarm;
              alarm.journey.expectedJourneyLength = this.convertSecsToMins(duration);
              this.props.actions.editAlarm(alarm);
          })
          .catch((err)=> {
            debugger;
            //TODO: show user that we couldnt calculate the journey time.
              this.setState({showProgress: false, error: err});
              return console.log(err);
          });
      }
    }
    else
    {
      //return start and end not set yet.
      this.setState({journeyTime: "Start and End need to be set!"})
    }
  }

  convertSecsToMins(secs){
    return secs/60;
  }

  addJourney(alarm=null){
    let alarmKey = Object.keys(this.props.state).find(x => x === this.state.currentAlarmId);
    let journey = alarmKey && this.props.state[alarmKey].journey;

    if(journey === undefined)
    {
      journey = alarm.journey || {};
    }
    // this.props.navigator.push({
    //     title: 'Journey Planner',
    //     component: MapContainer,
    //     rightButtonTitle: 'Done',
    //     onRightButtonPress: () => this.finishJourneySetUp(),
    //     passProps: {
    //       onStart: this.addStartToJourney, //use the mapView on Select method.
    //       onEnd: this.addEndToJourney,
    //       complete: this.finishJourneySetUp,
    //       start: journey && journey.journeyStart,
    //       end: journey && journey.destination
    //     }
    // });
    // this.props.apiActions.getCurrentPosition(navigator,
    navigator.geolocation.getCurrentPosition(
      (res) => {
        let currentLocation = {
          latitude: res.coords.latitude,
          longitude: res.coords.longitude
        };

        this.props.navigator.push({
            title: 'Journey Planner',
            component: MapContainer,
            rightButtonTitle: 'Done',
            onRightButtonPress: () => this.finishJourneySetUp(),
            passProps: {
              currentLocation: currentLocation,
              onStart: this.addStartToJourney, //use the mapView on Select method.
              onEnd: this.addEndToJourney,
              complete: this.finishJourneySetUp,
              start: journey && journey.journeyStart,
              end: journey && journey.destination,
              addLunchMarkers: () => this.addLunchMarkers,
              lunchMarkers: journey.lunchMarkers
            }
        });
      }
      ,(er) => {
        console.log(er);
        this.props.navigator.push({
            title: 'Journey Planner',
            component: MapContainer,
            rightButtonTitle: 'Done',
            onRightButtonPress: () => this.finishJourneySetUp(),
            passProps: {
              onStart: this.addStartToJourney, //use the mapView on Select method.
              onEnd: this.addEndToJourney,
              complete: this.finishJourneySetUp,
              start: journey && journey.journeyStart,
              end: journey && journey.destination,
              addLunchMarkers: () => this.addLunchMarkers,
              lunchMarkers: journey.lunchMarkers
            }
        });
      }
    );
  }

  addLunchMarkers(lunchMarkersArray){
    let alarmKey = Object.keys(this.props.state).find(x => x === this.state.currentAlarmId);
    let alarm = alarmKey && this.props.state[alarmKey];
    alarm.journey.lunchMarkers = lunchMarkersArray;
    this.setState({
      alarm: alarm
    });
    this.props.actions.editAlarm(alarm);
  }

  toggleChange(newValue){
    let alarm = this.state.alarm;
    // const updatedAlarm = Object.values(alarms).find(alarm => alarm.id === rowData.id);
    alarm.offWhenUpToggle = newValue;
    this.props.actions.editAlarm(alarm);
  }

  //make calc journey button readonly unless jounery params are set.
  render(){
    const alarm = this.props.state[this.state.currentAlarmId];
      return (
        <View
          style={styles.container}
        >
          {(this.state.addingAlarm || this.state.addingArrivalTime) && (
            <DatePickerIOS
              date={this.state.datePickerDate}
              mode={this.state.dateMode}
              timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
              onDateChange={this.onDateChange}
              style={styles.datePicker}
            />
          )}
          {this.state.addingAlarm &&
            <View>
              {/*<TouchableHighlight
                onPress={() => this.props.navigator.pop()}
                style={styles.button}>
                <Text style={styles.buttonText}>Set Alarm</Text>
              </TouchableHighlight>*/}
              <TouchableHighlight
                onPress={this.addAlarm}
                style={styles.button}>
                <Text style={styles.buttonText}>Add Journey</Text>
              </TouchableHighlight>
              {/*<TouchableHighlight
                  onPress={this.deleteAlarm}
                  style={styles.buttondanger}>
                  <Text style={styles.buttonText}>Delete Alarm</Text>
              </TouchableHighlight>*/}
            </View>}
          {this.state.addingArrivalTime &&
            <View>
              <TouchableHighlight
                onPress={this.showSummary}
                style={styles.button}>
                <Text style={styles.buttonText}>Show Summary</Text>
              </TouchableHighlight>
              {/*<TouchableHighlight
                  onPress={this.deleteJourneyTime}
                  style={styles.buttondanger}>
                  <Text style={styles.buttonText}>Delete Destination Time</Text>
              </TouchableHighlight>*/}
              <View style={styles.rowOfButtons}>
                <TouchableHighlight
                  onPress={() => this.changeJourneyType("car")}
                  style={alarm.journeyType==="car"?styles.journeyTypeButtonSelected:styles.journeyTypeButton}>
                  <Text style={styles.buttonText}>C</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.changeJourneyType("walk")}
                  style={alarm.journeyType==="walk"?styles.journeyTypeButtonSelected:styles.journeyTypeButton}>
                  <Text style={styles.buttonText}>W</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.changeJourneyType("cycle")}
                  style={alarm.journeyType==="cycle"?styles.journeyTypeButtonSelected:styles.journeyTypeButton}>
                  <Text style={styles.buttonText}>C</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.changeJourneyType("transit")}
                  style={alarm.journeyType==="transit"?styles.journeyTypeButtonSelected:styles.journeyTypeButton}>
                  <Text style={styles.buttonText}>T</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.switchContainer}>
                <Text>Switch me off when I leave</Text>
                <Switch
                  value={this.state.alarm.offWhenUpToggle}
                  onTintColor="rgba(228, 122, 11, 0.78)"
                  onValueChange={(value) => this.toggleChange(value)}
                />
              </View>
            </View>
          }

          {!this.state.addingAlarm && !this.state.addingArrivalTime && !this.state.showSummary && (
            <View style={styles.addingJourneyView}>
              <View style={styles.button}>
                <TouchableHighlight
                    onPress={this.addJourney}
                    style={styles.button}>
                    <Text style={styles.buttonText}>New Journey</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.addingJourneyList}>
                <JourneyListContainer
                    editAlarm={this.props.actions.editAlarm}
                    alarms={this.props.state}
                    currentAlarmId={this.state.currentAlarmId}
                    showArrivalTime={() => this.setState({addingArrivalTime: true})}
                />
              </View>
            </View>)
          }
          {
            this.state.showSummary && (
              <View>
              <Text style={styles.error}>Alarm @: {alarm? alarm.time.toLocaleString(): "not set yet"}.</Text>
              <Text style={styles.error}>Destination arrival @: {alarm && alarm.journey? alarm.journey.journeyTime.toLocaleString(): "not set yet"}.</Text>
              <Text style={styles.success}>Expected Journey Length Now: {alarm && alarm.journey && alarm.journey.expectedJourneyLength? alarm.journey.expectedJourneyLength.toString(): "N/A"} minutes</Text>
                {this.state.alarm.time && <TouchableHighlight
                    onPress={() => this.props.navigator.pop()}
                    style={styles.buttonSuccess}>
                    <Text style={styles.buttonText}>Done</Text>
                </TouchableHighlight>}
              </View>
            )
          }
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
    actions: AlarmActions(dispatch),
    apiActions: APIActions(dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlarmContainerWizard);

let styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(52, 48, 70, 0.92)",
        paddingTop: 100,
        padding: 10,
        alignItems: 'center',
        flex: 1
    },
    switchContainer: {
      flex: 1,
      flexDirection: "row",
      padding: 10,
      justifyContent: "space-between"
    },
    rowOfButtons: {
      flex: 1,
      flexDirection: "row",
      padding: 10,
      justifyContent: "space-between"
    },
    journeyTypeButtonSelected: {
      backgroundColor: '#48ec80',
      borderColor: '#020608',
      borderRadius: 5,
      marginTop: 30,
      marginBottom: 10,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      minWidth: 50,
      maxWidth: 50
    },
    journeyTypeButton: {
      backgroundColor: '#48BBEC',
      borderColor: '#48BBEC',
      borderRadius: 5,
      marginTop: 30,
      marginBottom: 10,
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      minWidth: 50,
      maxWidth: 50
    },
    switch: {

    },
    addingJourneyView: {
      flex: 1,
      alignItems: "stretch",
      flexDirection: "column",
      width: 400
    },
    addingJourneyList: {
      alignSelf: "stretch",
      bottom: 5,
      marginTop: 20,
      padding: 0,
      borderColor: "rgba(52, 48, 70, 0.92)"
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
      backgroundColor: "rgba(52, 48, 70, 0)",
      height: 225,
      width: 500,
      marginTop: 10,
      marginBottom: 10,
      paddingBottom: 40
    },
    button: {
        height: 50,
        maxWidth: 300,
        minWidth: 300,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 10,
        padding: 5,
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
