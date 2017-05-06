import React from 'react';
import MapView from 'react-native-maps';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native';

let id = 0;

let initialRegion = {
  latitude: 51.444075,
  longitude: -0.160629,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default class MapContainer extends React.Component {
  constructor(props){
    super(props);

    let journeyMarkerStart = this.props.start?{
      key: id++,
      location: this.props.start,
      start: true,
      title: "Beginning",
      description: "hey there"
    }:null;
    let journeyMarkerEnd = this.props.end?{
      key: id++,
      location: this.props.end,
      start: false,
      title: "End",
      description: "hey there"
    }:null;

    this.state = {
      region: {
        latitude: 51.444075,
        longitude: -0.160629,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
      journeyMarkers: [],
      selectingStartLocation: true,
      random: true
    };

    console.log(this.state.region);

    this.onRegionChange = this.onRegionChange.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.switchToStartChooser =this.switchToStartChooser.bind(this);
    this.switchToEndChooser =this.switchToEndChooser.bind(this);
  }

  onRegionChange(region) {
    console.log(region);
    this.setState({ region });
  }

  addMarker(event){
    debugger;
    let markers = this.state.markers;
    let newMarker = {
      key: id++,
      location: event.nativeEvent.coordinate,
      title: "normal",
      description: "yo"
    }
    markers = [...markers,newMarker];
    this.setState({ markers: markers });
  }

  addJourneyMarker(coordinate,start)
  {
    let journeyMarkers = this.state.journeyMarkers;

    let newMarker = {
      key: id++,
      location: coordinate,
      start: start,
      title: start? "Beginning" : "End",
      description: "hey there"
    }
    if(journeyMarkers.some(marker => { return marker.start == start} ))
    {
      journeyMarkers = [
        ...journeyMarkers.filter(marker => { return marker.start != start}),
        newMarker
      ];
    } else {
      journeyMarkers = [ ...journeyMarkers, newMarker];
    }
    this.setState({journeyMarkers: journeyMarkers, region: initialRegion},console.log(this.state.journeyMarkers));
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
  }

  onLongPress(event){
    //TODO: the user needs to see something if this happens.
    if(this.state.selectingStartLocation && this.props.onStart)
    {
      this.addJourneyMarker(event.nativeEvent.coordinate,true);
      //make it specific to start//could have a list marker objects which contain the type of marker
      return this.props.onStart(event.nativeEvent.coordinate);
    }
    else if(!this.state.selectingStartLocation && this.props.onEnd)
    {
      this.addJourneyMarker(event.nativeEvent.coordinate,false);
      return this.props.onEnd(event.nativeEvent.coordinate);
    }
  }

  switchToStartChooser(){
    // this.props.navigator.replace({title: 'Start Location (Work)'});
    this.setState({selectingStartLocation: true, region: initialRegion});
  }

  switchToEndChooser(){
    // Actions.refresh({title: 'End location (Work)'});
    this.setState({selectingStartLocation: false});
  }

  // provider={MapView.PROVIDER_GOOGLE}

  //render a search Bar
  //render buttons at the bottom between choosing the start and the end of the journey.
  //add mode of transport on a different screen?
  //button to say complete  which woudl call this.props.complete and maybe do navigation?
  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          style={StyleSheet.absoluteFill}
          onPress={this.onPress}
          onSelect={this.addMarker}
          onLongPress={this.onLongPress}
          showsTraffic
          loadingEnabled
          loadingIndicatorColor="#3bc91e"
        >
        {this.state.journeyMarkers.map(marker => {
          return marker.start != null? (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.location}
              title={marker.title}
              description={marker.description}
              pinColor={marker.start? "rgb(163, 45, 236)":"rgb(77, 236, 45)"}
              style={styles.marker}
            />
          )
          :
          (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.location}
              title={marker.title}
              description={marker.description}
              style={styles.marker}
            />
          )
        })}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.switchToStartChooser}
            style={this.state.selectingStartLocation?styles.activeButton:styles.dormantButton}
          >
            <Text>Beginning</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.switchToEndChooser}
            style={this.state.selectingStartLocation?styles.dormantButton:styles.activeButton}
          >
            <Text>End</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.complete()}
            style={styles.primaryButton}
          >
            <Text>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
    old_container: {
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
    old_button: {
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
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    bubble: {
      backgroundColor: 'rgba(255,255,255,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    latlng: {
      width: 200,
      alignItems: 'stretch',
    },
    button: {
      width: 80,
      paddingHorizontal: 12,
      alignItems: 'center',
      marginHorizontal: 10,
    },
    activeButton: {
      backgroundColor: 'rgba(100,255,100,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    dormantButton: {
      backgroundColor: 'rgba(255,255,255,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    primaryButton: {
      backgroundColor: 'rgba(33, 124, 230, 0.87)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginVertical: 50,
      backgroundColor: 'transparent',
    },
    marker: {
      width: 10,
      height: 10,
    }
});
