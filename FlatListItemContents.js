import React from 'react';
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

const item = ({id, alarm, onPressItem, selected, displayClockSectionAs12HourTime, toggleAlarm}) => {
  return (
    <TouchableHighlight
        onPress={()=> onPressItem()}
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
              source={{uri: alarm.actor.avatar_url}}
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
                  {alarm.time && `${displayClockSectionAs12HourTime(alarm.time.getHours())}:${displayClockSectionAs12HourTime(alarm.time.getMinutes())}`}
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
                    }}>{alarm.journey &&
                      alarm.journey.destination &&
                      alarm.journey.destination.info[0].feature
                     }</Text>

                </Text>
                <Text style={{
                    fontWeight: '600',
                    fontSize: 18,
                    color: "rgba(204, 3, 33, 0.78)"
                }}>
                  {
                      /*alarm.payload.ref.replace('refs/heads/', '')*/
                      alarm.journey &&
                      alarm.journey.expectedJourneyLength &&
                      `${alarm.journey.expectedJourneyLength.toString()} mins`
                  }
                </Text>
              </View>
              <Switch
                value={alarm.enabled?true:false}
                onTintColor="rgba(228, 122, 11, 0.78)"
                onValueChange={(value) => toggleAlarm(alarm,value)}
              />

          </View>
      </View>
    </TouchableHighlight>
  );
}

export default item;
