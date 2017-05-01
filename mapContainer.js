import React from 'react';
import MapView from 'react-native-maps';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

export default class MapContainer extends React.Component {
  constructor(props){
    super(props);

    this.state = this.getInitialState();

    this.onRegionChange = this.onRegionChange.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  getInitialState() {
    return {
      region: {
        latitude: 51.444075,
        longitude: -0.160629,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: []
    };
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  addMarker(coordinate){
    debugger;
    let markers = this.state.markers;
    markers = [...markers,coordinate];
    this.setState({ markers: markers });
  }

  onPress(event){
    if(this.props.onPress)
    {
      return this.props.onPress(event.nativeEvent.coordinate);
    }
    else
    {
      console.log(`The uses pressed: {Latitude: ${event.nativeEvent.coordinate.latitude},Longitude: ${event.nativeEvent.coordinate.longitude}}`);
    }
    debugger;
  }

  // provider={MapView.PROVIDER_GOOGLE}

  render() {
    return (
      <MapView
        region={this.state.region}
        onRegionChange={this.onRegionChange}
        style={StyleSheet.absoluteFill}
        onPress={this.onPress}
        onSelect={this.addMarker}
        showsTraffic

      >
      {this.state.markers.map(marker => (
        <MapView.Marker
          coordinate={marker.latlng}
          title={marker.title}
          description={marker.description}
        />
      ))}
      </MapView>
    );
  }
}

var styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        paddingTop: 40,
        padding: 10,
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 66,
        height:55
    },
    heading: {

        marginTop: 100,
        backgroundColor: "#f00",
        padding: 100
    },
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#48BBEC'
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
    }
});
