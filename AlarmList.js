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
            showProgress: true
        };
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
            id: alarmKey
          };
        });

      let currentDateTime = new Date();
      let ringingArray = this.state.ringingArray;
      let itemsToAdd = [];

      for (let index = 0; index < identifiedAlarmTimesArray.length; index++) {
        if(Math.abs(identifiedAlarmTimesArray[index].time - currentDateTime) < 1000)
        {
          let newItem = identifiedAlarmTimesArray[index].id;
          ringingArray = [
            ...ringingArray,
            newItem
          ];
        }
      }
      this.setState({ringingArray: ringingArray});
    }

    soundTheAlarm(){
      // Play the sound with an onEnd callback
      this.state.alarmSound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }

    stopAlarms(){
      this.setState({ringingArray:[]});
    }

    turnOffAlarm(removeId){
      let ringingArray = this.state.ringingArray
        .filter(id => id !== removeId);
      this.setState({ringingArray: ringingArray});
    }

    fetchAlarmsFromStore(nextProps){
      let alarms = this.props.alarms;
      if(nextProps)
      {
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
                            {rowData.time && `${rowData.time.getHours()}:${rowData.time.getMinutes()}`}
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
      //TODO If ringingArray.count > 0 then UN.
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

      if(this.state.ringingArray && this.state.ringingArray.length > 0)
      {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center'
            }}>
                <Text
                    style={{
                      color: 'red',
                      paddingTop: 10
                  }}
                >
                  Alarm Ringing
                </Text>
                {() => {
                  Alert.alert(
                    'GeoAlarm',
                    "Custom User Text To Be Set By User",
                    [
                      {text: 'Stop', onPress: () => this.stopAlarms()},
                      {text: 'OK', onPress: () => console.log('OK Pressed!')},
                    ],
                    {cancelable: false}
                  );
                  this.soundTheAlarm();
                }}
                <TouchableHighlight style={styles.wrapper}
                  onPress={() => Alert.alert(
                    'Alert Title',
                    "alertMessage",
                    [
                      {text: 'Stop', onPress: () => this.stopAlarms()},
                      {text: 'OK', onPress: () => console.log('OK Pressed!')},
                    ],
                    {cancelable: false}
                  )}>
                  <View style={styles.button}>
                    <Text>Alert with two buttons</Text>
                  </View>
                </TouchableHighlight>
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
        </View>
      );
    }
}

let styles = StyleSheet.Create({
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
