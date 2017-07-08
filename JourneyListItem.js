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

const item = ({id, alarm, onPressItem, selected}) => {
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
          justifyContent: 'center',
          borderColor: 'transparent',
          borderBottomWidth: 1,
          backgroundColor: "rgba(52, 48, 70, 0)",

      }}>
          {/*}<Image
              source={{uri: alarm.actor.avatar_url}}
              style={{
                  height: 36,
                  width: 36,
                  borderRadius: 18
              }}
          />*/}
          {/*//TODO: Lets just create a list of journey destinations, we should probably use the same
          // journey start as on set up we specifically ask the user for this rather than just using
          // the current location.*/}
          <Text style={{
              fontWeight: '600',
              fontSize: 32,
              color: "rgba(228, 122, 11, 0.78)"
          }}>
            {alarm.journey && alarm.journey.destination && alarm.journey.destination.info[0].feature}
          </Text>
      </View>
    </TouchableHighlight>
  );
}

export default item;
