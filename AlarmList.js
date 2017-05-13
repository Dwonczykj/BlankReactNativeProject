'use strict';

import React from 'react';
import {
  Text,
  View,
  ListView,
  ActivityIndicator,
  Image,
  TouchableHighlight
} from 'react-native';
import AlarmContainer from 'AlarmContainer2';
import {getAuthInfo} from './AuthService';

var moment = require('moment');
var PushPayload = require('./PushPayload.js');

export default class AlarmList extends React.Component {
    constructor(props){
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });

        this.state = {
            dataSource: ds,
            showProgress: true
        };
    }

    componentDidMount(){
        this.fetchAlarmsFromStore();
    }

    fetchAlarmsFromStore(){
        //implement Redux for react-native.
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

    renderRow(rowData){
        return (
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
                        <Text>
                            {rowData.alarmTime}
                        </Text>
                        <Text>
                            <Text style={{
                                fontWeight: '600'
                            }}>{rowData.alarmDestination}</Text> will take
                        </Text>
                        <Text>
                            {rowData.payload.ref.replace('refs/heads/', '')}
                        </Text>
                        <Text>
                            at <Text style={{
                                fontWeight: '600'
                            }}>{rowData.alarmEnabled}</Text>
                        </Text>

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
                renderRow={this.renderRow.bind(this)} />
        </View>
      );
    }
}
