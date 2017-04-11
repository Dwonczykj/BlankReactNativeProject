import React from 'react';
// import MapView from 'react-native-maps';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class MapContainer extends React.Component {
  constructor(props){
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <View />      
    );
  }
}
