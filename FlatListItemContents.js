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
          borderColor: 'transparent',
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
              <View style={styles.AlarmDetailContainer}>
                <Text style={styles.AlarmTimeTime}>
                    {alarm.time && `${displayClockSectionAs12HourTime(alarm.time.getHours())}:${displayClockSectionAs12HourTime(alarm.time.getMinutes())}`}
                    <Text style={{fontSize: 15, fontWeight: '300'}}>{alarm.time.getHours()>11&&alarm.time.getHours()<24?"pm":"am"}</Text>
                </Text>
                <Text style={styles.AlarmDetailElement}>
                  {alarm.time && `${alarm.time.getDate()}/${alarm.time.getMonth()}/${alarm.time.getFullYear()}`}
                </Text>
              </View>
              <View style={styles.AlarmDetailContainer}>
                <Text style={styles.AlarmDetailElement}>
                  {alarm.journey &&
                    alarm.journey.destination &&
                    alarm.journey.destination.info[0].feature &&
                    (alarm.journey.destination.info[0].feature.length > 20? `${alarm.journey.destination.info[0].feature.substr(0,20)}...`:alarm.journey.destination.info[0].feature) }
                </Text>
                <Text style={styles.AlarmDetailElementDanger}>
                  {
                      /*alarm.payload.ref.replace('refs/heads/', '')*/
                      alarm.journey &&
                      alarm.journey.expectedJourneyLength &&
                      `${parseInt(alarm.journey.expectedJourneyLength).toString()} mins`
                  }
                </Text>
                <Text style={styles.AlarmDetailElement}>
                  {alarm.journeyType}
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

let styles = StyleSheet.create({
  AlarmDetailContainer: {
    flex: 0,
    alignItems: "center"
  },
  AlarmDetailElement: {
    fontWeight: '300',
    fontSize: 15,
    color: "rgba(228, 122, 11, 0.78)"
  },
  AlarmDetailElementDanger: {
    fontWeight: '600',
    fontSize: 18,
    color: "rgba(204, 63, 33, 0.78)"
  },
  AlarmTimeTime: {
    fontWeight: '600',
    fontSize: 32,
    color: "rgba(228, 122, 11, 0.78)"
  },
  AlarmTimeDate: {

  }
});

export default item;
