import React from 'react';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoder';
import MapSearchBox from './mapSearchBox';

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
import PriceMarker from './PriceMarker';

Geocoder.fallbackToGoogle("AIzaSyD66bZZp986PADV5Epxe1eU6HJ0li2iq-c");

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

let initialRegion = {
  latitude: 51.444075,
  longitude: -0.160629,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

let defaults = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

const timeout = 4000;
let animationTimeout;

export default class MapContainer extends React.Component {
  constructor(props){
    super(props);

    let markers = [];

    markers = this.props.start ? markers.concat({
      key: id++,
      location: this.props.start,
      start: true,
      title: "Beginning",
      description: "hey there"
    })
    :
    markers;
    markers = this.props.end ? markers.concat({
      key: id++,
      location: this.props.end,
      start: false,
      title: "End",
      description: "hey there"
    })
    :
    markers;

    this.state = {
      region: {
        latitude: 51.444075,
        longitude: -0.160629,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      events: [],
      markers: [],
      journeyMarkers: markers,
      selectingStartLocation: true
    };

    this.onRegionChange = this.onRegionChange.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.switchToStartChooser =this.switchToStartChooser.bind(this);
    this.switchToEndChooser =this.switchToEndChooser.bind(this);
    this.moveToAndAddMarkerAt = this.moveToAndAddMarkerAt.bind(this);
    this.makeMarkerAJourneyMarker = this.makeMarkerAJourneyMarker.bind(this);
  }

  componentDidMount(){
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  convertEventCoordinateToGeocodeCoord(coordinate){
    return {
      lat: coordinate.latitude,
      lng: coordinate.longitude
    };
  }

  addMarker(event){

    let markers = this.state.markers;
    let newMarker = {
      key: id++,
      location: null,
      title: "normal",
      description: "yo"
    }
    Geocoder.geocodePosition(convertEventCoordinateToGeocodeCoord(event.nativeEvent.coordinate))
      .then(res => {
        newMarker.location = res;
        markers = [...markers,newMarker];
        this.setState({ markers: markers });
        return markers;
      })
      .catch(res => console.log(res));

  }

  addJourneyMarker(location,start)
  {
    let journeyMarkers = this.state.journeyMarkers;

    let newMarker = {
      key: id++,
      location: location,
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


    this.setState({journeyMarkers: journeyMarkers/*, region: initialRegion*/},
      () =>  {
        if(journeyMarkers.length == 2)
        {
          this.focusMap([
            journeyMarkers[1],
            journeyMarkers[0],
          ], true);
        }
      }
    );
  }

  onPress(event){
    if(this.props.onPress)
    {
      return this.props.onPress(event.nativeEvent.coordinate);
    }
  }

  onLongPress(event){
    const geoloc = {
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    }
    const location = {
      coordinate: event.nativeEvent.coordinate,
      info: null
    }
    Geocoder.geocodePosition(geoloc)
      .then(res => {
          location.info = res;
          if(this.state.selectingStartLocation && this.props.onStart)
          {
            this.addJourneyMarker(location,true);
            this.setState({selectingStartLocation: false});
            //make it specific to start//could have a list marker objects which contain the type of marker
            return this.props.onStart(location);
          }
          else if(!this.state.selectingStartLocation && this.props.onEnd)
          {
            this.addJourneyMarker(location,false);
            this.setState({selectingStartLocation: true});
            return this.props.onEnd(location);
          }
      })
      .catch(err => console.log(err));//TODO: need error handling in here for user.

    // // Address Geocoding
    // Geocoder.geocodeAddress('New York').then(res => {
    //     // res is an Array of geocoding object (see below)
    // })
    // .catch(err => console.log(err))



  }

  makeMarkerAJourneyMarker(markerKey,location){
    let markers = this.state.markers;

    if(this.state.selectingStartLocation && this.props.onStart)
    {
      this.addJourneyMarker(location.coordinate,true);
      //make it specific to start//could have a list marker objects which contain the type of marker
      this.props.onStart(location);
    }
    else if(!this.state.selectingStartLocation && this.props.onEnd)
    {
      this.addJourneyMarker(location.coordinate,false);
      this.props.onEnd(location);
    }
    markers = markers.filter(marker => marker.key !== markerKey);
    return this.setState({markers});
  }

  switchToStartChooser(){
    // this.props.navigator.replace({title: 'Start Location (Work)'});
    let currentRegion = this.state.region;
    this.setState({selectingStartLocation: true, region: currentRegion});
  }

  switchToEndChooser(){
    // Actions.refresh({title: 'End location (Work)'});
    let currentRegion = this.state.region;
    this.setState({selectingStartLocation: false, region: currentRegion});
  }

  moveToAndAddMarkerAt(apiResponse){
    const coordinate = {
      lat: apiResponse.geometry.location.lat,
      lng: apiResponse.geometry.location.lng
    };
    const newMarker = {
      key: id++,
      location: null,
      title: apiResponse.formatted_address
    };
    let markers = this.state.markers;
    Geocoder.geocodePosition(convertEventCoordinateToGeocodeCoord(coordinate))
      .then(res => {
        newMarker.location = res;
        markers = [
          ...markers,
          newMarker
        ]
        this.setState({markers: markers});
        return markers;
      })
      .catch(res => console.log(res));

    this.setState({
      region: {
        latitude: coordinate.lat,
        longitude: coordinate.lng,
        latitudeDelta: defaults.latitudeDelta,
        longitudeDelta: defaults.longitudeDelta,
      }
    });
  }

  focusMap(markers, animated) {
    console.log(`Markers received to populate map: ${markers}`);
    this.map.fitToSuppliedMarkers(markers, animated);
  }

  // provider={MapView.PROVIDER_GOOGLE}

  //render a search Bar
  //render buttons at the bottom between choosing the start and the end of the journey.
  //add mode of transport on a different screen?
  //button to say complete  which woudl call this.props.complete and maybe do navigation?

  //add a callout after searchinng which says Start Here and is a button. Or End here.
  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          ref={ref => { this.map = ref; }}
          onRegionChangeComplete={this.onRegionChange}
          style={StyleSheet.absoluteFill}
          onPress={this.onPress}
          onSelect={this.addMarker}
          onLongPress={this.onLongPress}
          showsTraffic
          showsMyLocationButton
          loadingEnabled
          loadingIndicatorColor="#3bc91e"
        >
          {this.state.journeyMarkers.map(marker => {
            return marker.start != null? (
              <MapView.Marker
                key={marker.key}
                coordinate={marker.location.coordinate}
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
                coordinate={marker.location.coordinate}
                title={marker.title}
                style={styles.marker}
              />
            )
          })}
          {this.state.markers.map(marker => {
            return (
              // <MapView.Marker
              //   key={marker.key}
              //   coordinate={marker.location}
              //   title={marker.title}
              //   style={styles.marker}
              // />
              <MapView.Marker
                  key={marker.key}
                  title={marker.title}
                  style={styles.marker}
                  coordinate={marker.location.coordinate}
                  onSelect={() => console.log("marker selected")}
                  onDeselect={() => console.log("marker deselected")}
              >
                  <PriceMarker amount={99} />
                  <MapView.Callout
                    style={styles.callout}

                    onPress={() => this.makeMarkerAJourneyMarker(marker.key,marker.location)}
                  >
                    <View style={styles.callout} >
                      <Text style={styles.calloutText}>{this.state.selectingStartLocation?'Start':'End'} Here?</Text>
                    </View>
                  </MapView.Callout>
              </MapView.Marker>
            );
          })}
        </MapView>
        <View style={styles.searchBoxContainer}>
          <MapSearchBox
            onSearch={this.moveToAndAddMarkerAt}
            containerStyle={styles.searchBox}
            inputStyle={styles.searchBoxInput}
            placeholder={this.state.selectingStartLocation?
              "Where will your journey begin?":
              "Where will your journey end?"
            }
          />
        </View>
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
    calloutButton: {
      backgroundColor: 'rgba(33, 124, 230, 0.87)',
      paddingHorizontal: 1,
      paddingVertical: 1
    },
    buttonContainer: {
      flexDirection: 'row',
      marginVertical: 50,
      backgroundColor: 'transparent',
    },
    searchBox: {
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      backgroundColor: 'rgba(104, 249, 227, 0.39)',
    },
    searchBoxInput: {
      backgroundColor: 'rgba(249, 249, 249, 0.73)',
      color: 'rgb(30, 42, 34)'
    },
    searchBoxContainer: {
      flex: 1,
      marginTop: 60,
      marginBottom: 500,
      height: 90,
      alignSelf: "stretch"
    },
    marker: {
      width: 25,
      height: 25,
    },
    callout: {
      width: 200,
      height: 15,
      backgroundColor: 'transparent',
      alignItems: 'center'
    },
    calloutText: {
      backgroundColor: 'transparent'
    }
});
