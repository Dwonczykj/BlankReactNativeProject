'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View,
  ListView,
  ActivityIndicator,
  Image,
  Switch,
  TouchableHighlight
} from 'react-native';
import AlarmActions from './Actions/alarmActions';
import AlarmContainer from './AlarmContainer2';
import {getAuthInfo} from './AuthService';

var moment = require('moment');
var PushPayload = require('./PushPayload.js');

class AlarmList extends React.Component {
    constructor(props){
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.state = {
            dataSource: ds,
            alarms: {},
            showProgress: true
        };
    }

    componentDidMount(){
        this.fetchAlarmsFromStore();
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
        this.props.navigator.push({
            title: `${rowData.Alarm} Alarm Detail`,
            component: AlarmContainer,
            passProps: {
                pushEvent: rowData
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
        </View>
      );
    }
}

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
