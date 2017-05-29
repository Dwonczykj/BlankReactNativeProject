'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
  Alert,
  Text,
  View,
  ListView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Switch,
  TouchableHighlight
} from 'react-native';
import AlarmActions from './Actions/alarmActions';
import AlarmContainer from './AlarmContainer2';
import {getAuthInfo} from './AuthService';

let moment = require('moment');
let PushPayload = require('./PushPayload.js');


// Import the react-native-sound module
var Sound = require('react-native-sound');

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

let j = 0;

class AlarmList extends React.Component {
    constructor(props){
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        // Load the sound file 'Alarm-clock-sound.mp3' from the app bundle
        // See notes below about preloading sounds within initialization code below.
        let whoosh = new Sound('Alarm-clock-sound.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('failed to load the sound', error);
            return;
          }
          // loaded successfully
          console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
        });

        // Loop indefinitely until stop() is called
        whoosh.setNumberOfLoops(-1);

        whoosh.setVolume(1.5);

        this.state = {
            dataSource: ds,
            alarms: {},
            alarmSound: whoosh,
            ringingArray: [],
            // alreadyRinging: false,
            showProgress: true
        };

        this.soundTheAlarm = this.soundTheAlarm.bind(this);
    }

    // get alarmSound() {
    //   return
    // }

    componentDidMount(){
        this.fetchAlarmsFromStore();
        this.timerID = setInterval(
          () => this.checkAlarms(),
          1000
        );
    }

    // shouldComponentUpdate(nextProps){
    //   return true;
    // }

    componentWillReceiveProps(nextProps){
      if(nextProps.alarms && Object.keys(nextProps.alarms).length > 0)
      {
        this.fetchAlarmsFromStore(nextProps);
      }

    }

    componentWillUnmount() {
      clearInterval(this.timerID);
      let soundResource = this.state.alarmSound;
      soundResource.release();
    }

    checkAlarms(){
      let identifiedAlarmTimesArray = Object.keys(this.props.alarms)
        .map(alarmKey => {
          return {
            time: this.props.alarms[alarmKey].time,
            enabled: this.props.alarms[alarmKey].enabled,
            id: alarmKey
          };
        });

      let currentDateTime = new Date();
      let ringingArray = this.state.ringingArray;
      let itemsToAdd = [];

      for (let index = 0; index < identifiedAlarmTimesArray.length; index++) {
        if(identifiedAlarmTimesArray[index].enabled && Math.abs(identifiedAlarmTimesArray[index].time - currentDateTime) < 1000)
        {
          let alarmId = identifiedAlarmTimesArray[index].id;
          ringingArray = [
            ...ringingArray,
            alarmId
          ];
        }
      }
      if(ringingArray.length > 0)
      {
        this.setState({ringingArray: ringingArray});
      }
    }

    soundTheAlarm(){
      j = 1;
      Alert.alert(
        'GeoAlarm',
        "Custom User Text To Be Set By User",
        [
          {text: 'Stop', onPress: () => this.stopAlarms()}
        ],
        {cancelable: false}
      )
      // Play the sound with an onEnd callback

      this.state.alarmSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }

    displayClockSectionAs12HourTime(section){
      if(section<10){
        return `0${section.toString()}`;
      } else{
        return section.toString();
      }
    }

    // displayClockAs24HourTime(){
    //
    // }

    stopAlarms(){
      j = 0;
      this.state.alarmSound.stop();

      const alarms = this.props.alarms;
      const ringingAlarmIds = Object.keys(alarms).filter(alarmId => this.state.ringingArray.includes(alarmId));
      const disabledAlarms = ringingAlarmIds.map(ringingId => {
        let disabledAlarm = this.props.alarms[ringingId];
        disabledAlarm.enabled = false;
        return disabledAlarm;
      });
      for (var index in disabledAlarms) {
        if (disabledAlarms.hasOwnProperty(index)){
          this.props.actions.editAlarm(disabledAlarms[index]);
        }
      }
      this.setState({ringingArray:[]});
      //TODO: All alarms that were enabled need a temporary flag to say that they have gone off for today.
    }

    // turnOffAlarm(removeId){
    //
    //   let ringingArray = this.state.ringingArray
    //     .filter(id => id !== removeId);
    //   this.setState({ringingArray: ringingArray});
    // }

    fetchAlarmsFromStore(nextProps){
      let alarms = this.props.alarms;

      if(nextProps)
      {
        debugger;
        alarms = nextProps.alarms;
      }
      
      console.log(this.state.dataSource
        .cloneWithRows(Object.values(alarms)/*,Object.keys(alarms)*/));
      this.setState({
        alarms: alarms,
        dataSource: this.state.dataSource
          .cloneWithRows(Object.values(alarms)/*,Object.keys(alarms)*/),
        showProgress: false
      });
    }

    pressRow(rowData){
      // navigator.geolocation.getCurrentPosition(
      //   (res) => {
      //     let coordinate = {
      //       latitude = res.coords.latitude,
      //       longitude = res.coords.longitude
      //     };
      //
      //     this.props.navigator.push({
      //         title: `${rowData.time && `${rowData.time.getHours()}:${rowData.time.getMinutes()}`} Alarm Detail`,
      //         component: AlarmContainer,
      //         passProps: {
      //             alarm: rowData,
      //             currentLocation: coordinate
      //         }
      //     });
      //   }
      //   ,(er) => {
      //     console.log(er);
      //     this.props.navigator.push({
      //         title: `${rowData.time && `${rowData.time.getHours()}:${rowData.time.getMinutes()}`} Alarm Detail`,
      //         component: AlarmContainer,
      //         passProps: {
      //             alarm: rowData
      //         }
      //     });
      //   }
      // );
      this.props.navigator.push({
          title: `${rowData.time && `${rowData.time.getHours()}:${rowData.time.getMinutes()}`} Alarm Detail`,
          component: AlarmContainer,
          passProps: {
              alarm: rowData
          }
      });
    }

    toggleChange(rowData,newValue){
      let alarms = this.props.alarms;
      const updatedAlarm = Object.values(alarms).find(alarm => alarm.id === rowData.id);
      updatedAlarm.enabled = newValue;
      this.props.actions.editAlarm(updatedAlarm);
    }

    renderRow(rowData, sectionID, rowID, highlightRow){
        return rowData ? (
            <TouchableHighlight
                onPress={()=> this.pressRow(rowData)}
                underlayColor='#ddd'
            >
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    padding: 20,
                    alignItems: 'center',
                    borderColor: '#D7D7D7',
                    borderBottomWidth: 1,
                    backgroundColor: "rgba(52, 48, 70, 0.92)",

                }}>
                    {/*}<Image
                        source={{uri: rowData.actor.avatar_url}}
                        style={{
                            height: 36,
                            width: 36,
                            borderRadius: 18
                        }}
                    />*/}

                    <View style={{
                        paddingLeft: 20,
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",

                    }}>
                        <Text style={{
                            fontWeight: '600',
                            fontSize: 32,
                            color: "rgba(228, 122, 11, 0.78)"
                        }}>
                            {rowData.time && `${this.displayClockSectionAs12HourTime(rowData.time.getHours())}:${this.displayClockSectionAs12HourTime(rowData.time.getMinutes())}`}
                        </Text>
                        <View>
                          <Text style={{
                              fontWeight: '300',
                              fontSize: 11,
                              color: "rgba(247, 198, 146, 0.86)"
                          }}>
                              <Text style={{
                                  fontWeight: '300',
                                  fontSize: 10,
                                  color: "rgba(228, 122, 11, 0.78)"
                              }}>{rowData.journey &&
                                rowData.journey.destination &&
                                rowData.journey.destination.info[0].feature
                               }</Text>

                          </Text>
                          <Text style={{
                              fontWeight: '600',
                              fontSize: 18,
                              color: "rgba(204, 3, 33, 0.78)"
                          }}>
                            {
                                /*rowData.payload.ref.replace('refs/heads/', '')*/
                                rowData.journey &&
                                rowData.journey.expectedJourneyLength &&
                                `${rowData.journey.expectedJourneyLength.toString()} mins`
                            }
                          </Text>
                        </View>
                        <Switch
                          value={rowData.enabled?true:false}
                          onTintColor="rgba(228, 122, 11, 0.78)"
                          onValueChange={(value) => this.toggleChange(rowData,value)}
                        />

                    </View>
                </View>
            </TouchableHighlight>
        )
        :
        (
          <TouchableHighlight
              onPress={()=> this.pressRow(rowData)}
              underlayColor='#ddd'
          >
              <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  padding: 20,
                  alignItems: 'center',
                  borderColor: '#D7D7D7',
                  borderBottomWidth: 1,
                  backgroundColor: '#00f'
              }}>
                  {/*}<Image
                      source={{uri: rowData.actor.avatar_url}}
                      style={{
                          height: 36,
                          width: 36,
                          borderRadius: 18
                      }}
                  />*/}

                  <View style={{
                      paddingLeft: 20
                  }}>
                      <Text>Nothing to show</Text>
                  </View>
              </View>
          </TouchableHighlight>
        );
    }

    render(){

      if(this.state.showProgress){
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}>
                <ActivityIndicator
                    size="large"
                    animating={true} />
            </View>
        );
      }

      return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-start'
        }}>
            <ListView
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={this.renderRow.bind(this)} />
            {this.state.ringingArray && this.state.ringingArray.length > 0 && j == 0
              &&
              this.soundTheAlarm()
            }
        </View>
      );
    }
}

let styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
});

const mapStateToProps = (store) =>
{
  return {
    alarms: store.alarms
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
)(AlarmList);
