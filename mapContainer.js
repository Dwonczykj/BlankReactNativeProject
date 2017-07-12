import React from 'react';
import MapView from 'react-native-maps';
// import Geocoder from 'react-native-geocoder';
import MapSearchBox from './mapSearchBox';
import APIActions from './Actions/fetchRequestActions';
import {connect} from 'react-redux';

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

// Geocoder.fallbackToGoogle("AIzaSyD66bZZp986PADV5Epxe1eU6HJ0li2iq-c");

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;

let defaults = {
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
}

const timeout = 4000;
let animationTimeout;

class MapContainer extends React.Component {
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
        latitude: this.props.coordinate?this.props.currentLocation.latitude:51.444075,
        longitude: this.props.coordinate?this.props.currentLocation.longitude:-0.160629,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      events: [],
      markers: [],
      journeyMarkers: markers,
      lunchMarkers: this.props.lunchMarkers?this.props.lunchMarkers:[],
      selectingStartLocation: true,
      showProgress: false
    };

    this.onRegionChange = this.onRegionChange.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.switchToStartChooser =this.switchToStartChooser.bind(this);
    this.switchToEndChooser =this.switchToEndChooser.bind(this);
    this.moveToAndAddMarkerAt = this.moveToAndAddMarkerAt.bind(this);
    this.makeMarkerAJourneyMarker = this.makeMarkerAJourneyMarker.bind(this);
    this.dragMarker = this.dragMarker.bind(this);

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
    this.showSpinner(true);
    let markers = this.state.markers;
    let newMarker = {
      key: id++,
      location: null,
      title: "normal",
      description: "yo"
    }
    this.props.actions.geocodePosition(convertEventCoordinateToGeocodeCoord(event.nativeEvent.coordinate))
      .then(res => {
        newMarker.location = res[0];
        markers = [...markers,newMarker];
        this.setState({ markers: markers });
        this.showSpinner(false);
        return markers;
      })
      .catch(res => {
        console.log(res)
        this.showSpinner(false);
      });

  }

  addJourneyMarker(location,start,cb)
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
    if(newMarker.start == false)
    {
      this.addLunchPlacesToMapAround(newMarker.location.coordinate);
    }

    this.setState({journeyMarkers: journeyMarkers},
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
    if(cb)
    {
      cb();
    }
  }

  addLunchPlacesToMapAround(coordinate){
    let request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinate.latitude},${coordinate.longitude}&radius=500&type=restaurant&key=AIzaSyD66bZZp986PADV5Epxe1eU6HJ0li2iq-c`;
    this.showSpinner(true);
    this.props.actions.fetchRequest(request)
      .then((response)=> {
          this.showSpinner(false);
          if(response.status >= 200 && response.status < 300){
              return response;
          }

          throw {
              badCredentials: response.status == 401,
              unknownError: response.status != 401,
              requestCountExceeded: response.status == 900
          }
      })
      .then((response)=> {
          return response.json();
      })
      .then((results)=> {
          let lunchMarkersArray = results.results.map(result => {
            return {
              key: id++,
              location: {
                coordinate: {
                  latitude: result.geometry.location.lat,
                  longitude: result.geometry.location.lng
                }
              },
              rating: result.rating,
              icon: result.icon,
              title: result.name

            }
          });
          this.props.addLunchMarkers(lunchMarkersArray);
          this.setState({lunchMarkers: lunchMarkersArray});
      })
      .catch((err)=> {
        debugger;
          this.showSpinner(false);
          this.setState({error: err});
          return console.log(err);
      });
  }

  onPress(event){
    if(this.props.onPress)
    {
      return this.props.onPress(event.nativeEvent.coordinate);
    }
  }

  showSpinner(show){
    this.setState({showProgress: show});
  }

  onLongPress(event){
    this.showSpinner(true);
    const geoloc = {
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    }
    const location = {
      coordinate: event.nativeEvent.coordinate,
      info: null
    }
    this.props.actions.geocodePosition(geoloc)
      .then(res => {
          location.info = res;
          if(this.state.selectingStartLocation && this.props.onStart)
          {
            this.addJourneyMarker(location,true,() => this.showSpinner(false));
            this.setState({selectingStartLocation: false});
            //make it specific to start//could have a list marker objects which contain the type of marker
            return this.props.onStart(location);
          }
          else if(!this.state.selectingStartLocation && this.props.onEnd)
          {
            this.addJourneyMarker(location,false,() => this.showSpinner(false));
            this.setState({selectingStartLocation: true});
            return this.props.onEnd(location);
          }
      })
      .catch(err => {
        this.showSpinner(false);
        if(err.status == 900)
        {
          console.log("Request count exceeded.");
        }else{
          console.log(err)
        }
      });//TODO: need error handling in here for user.

    // // Address Geocoding
    // Geocoder.geocodeAddress('New York').then(res => {
    //     // res is an Array of geocoding object (see below)
    // })
    // .catch(err => console.log(err))



  }

  makeMarkerAJourneyMarker(markerKey,location){
    let markers = this.state.markers;

    const geoloc = {
      lat: location.coordinate.latitude,
      lng: location.coordinate.longitude
    }
    let loc = location;
    this.showSpinner(true);
    this.props.actions.geocodePosition(geoloc)
      .then(res => {
          loc.info = res;
          if(this.state.selectingStartLocation && this.props.onStart)
          {
            this.addJourneyMarker(loc,true,() => this.showSpinner(false));
            //make it specific to start//could have a list marker objects which contain the type of marker
            this.props.onStart(loc);
          }
          else if(!this.state.selectingStartLocation && this.props.onEnd)
          {
            this.addJourneyMarker(loc,false,() => this.showSpinner(false));
            this.props.onEnd(loc);
          }
          markers = markers.filter(marker => marker.key !== markerKey);
          return this.setState({markers});
      })
      .catch(err => {
        this.showSpinner(false);
        if(err.status == 900)
        {
          console.log("Request count exceeded.");
        }else{
          console.log(err)
        }
      });//TODO: need error handling in here for user.
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
      location: {
        info: null,
        coordinate: null
      },
      title: apiResponse.formatted_address
    };
    let markers = this.state.markers
    this.showSpinner(true);
    this.props.actions.geocodePosition(coordinate)
      .then(res => {
        newMarker.location.info = res[0];
        newMarker.location.coordinate = {
          latitude: coordinate.lat,
          longitude: coordinate.lng
        }
        markers = [
          ...markers,
          newMarker
        ]
        this.setState({markers: markers});
        this.showSpinner(false);
        return markers;
      })
      .catch(res => {
        console.log(res);
        this.showSpinner(false);
      });

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

  dragMarker(markerKey,coordinate,journeyMarker=true){
    const markers = journeyMarker?this.state.journeyMarkers:this.state.markers;
    let marker = markers.find(marker => marker.key === markerKey);
    marker.coordinate = coordinate;
    let otherMarkers = markers.filter(marker => marker.key !== markerKey);
    if(journeyMarker) this.setState({journeyMarkers: [...otherMarkers,marker]});
    else this.setState({markers: [...otherMarkers,marker]});
  }

  getPercentageLength(length,percentage){
    if(!(typeof(percentage) === "number") || !(typeof(length) === "number"))
    {
      throw new Exception();
    }
    return Math.round(length * percentage);
  }

  toggleMarkerType(key){

    let journeyMarkers = this.state.journeyMarkers;
    let currentMarker = journeyMarkers.find(marker => marker.key === key);
    let currentSetUp = currentMarker.start;
    let replacementMarker = {
      key: id++,
      location: currentMarker.location,
      start: !currentSetUp,
      title: currentMarker.title,
      description: currentMarker.description
    };
    this.setState({journeyMarkers: [replacementMarker], selectingStartLocation: currentSetUp},
    () => {
      if(currentSetUp)
      {
        this.addLunchPlacesToMapAround(currentMarker.location.coordinate);
      }
      else {
        this.setState({lunchMarkers: []});
      }
    });
  }

  // provider={MapView.PROVIDER_GOOGLE}

  //render a search Bar
  //render buttons at the bottom between choosing the start and the end of the journey.
  //add mode of transport on a different screen?
  //button to say complete  which woudl call this.props.complete and maybe do navigation?

  //add a callout after searchinng which says Start Here and is a button. Or End here.
  // pinColor={marker.start? "rgb(163, 45, 236)":"rgb(77, 236, 45)"}
  //TODO: Styling for markers wont work as need to change the size of the png through scaling or somehting

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
          loadingBackgroundColor="rgba(52, 48, 70, 0.92)"
        >
          {this.state.journeyMarkers.map(marker => {
            return marker.start != null && (
              <MapView.Marker
                key={marker.key}
                coordinate={marker.location.coordinate}
                title={marker.title}
                description={marker.description}
                image={marker.start?require("./img/markers/66x88/real-estate.v3.png"):require("./img/markers/66x88/business.v1.png")}
                centerOffset={{x:0,y:-11}}

                style={styles.marker}
              >
                <MapView.Callout
                  style={styles.callout}
                  onPress={() => this.toggleMarkerType(marker.key)}
                >
                  <View style={styles.callout} >
                    <Text style={styles.calloutText}>{marker.start?'Change to End':'Change to Start'}?</Text>
                  </View>
                </MapView.Callout>
              </MapView.Marker>
            )
          })}
          {this.state.markers.map(marker => {
            return (
              <MapView.Marker
                  draggable
                  key={marker.key}
                  title={marker.title}
                  style={styles.marker}
                  coordinate={marker.location.coordinate}
                  onDragEnd={(e) => this.dragMarker(marker.key,e.nativeEvent.coordinate,false)}
                  onSelect={() => console.log("marker selected")}
                  onDeselect={() => console.log("marker deselected")}
              >
                  {/* <PriceMarker amount={99} /> */}
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
          {(this.state.region.latitudeDelta < 0.005 && this.state.region.longitudeDelta < 0.005) && this.state.lunchMarkers.map(marker => {
            return (
              <MapView.Marker
                  key={marker.key}
                  title={marker.title}
                  style={styles.lunchMarker}
                  image={{uri: marker.icon}}
                  coordinate={marker.location.coordinate}

                  onSelect={() => console.log("marker selected")}
                  onDeselect={() => console.log("marker deselected")}
              >
                  {/* <PriceMarker amount={99} /> */}
                  <MapView.Callout
                    style={styles.callout}
                    onPress={() => console.log(marker.key)}
                  >
                    <View style={styles.callout} >
                      <Text style={styles.calloutText}>Lunch here?</Text>
                    </View>
                  </MapView.Callout>
              </MapView.Marker>
            );
          })}
          {(this.state.region.latitudeDelta >= 0.005 && this.state.region.longitudeDelta >= 0.005) && this.state.lunchMarkers
            .sort((a,b) => b.rating - a.rating)
            .slice(0,this.getPercentageLength(this.state.lunchMarkers.length,0.2))
            .map(marker => {
            return (
              <MapView.Marker
                  key={marker.key}
                  title={marker.title}
                  style={styles.lunchMarker}
                  image={{uri: marker.icon}}
                  coordinate={marker.location.coordinate}

                  onSelect={() => console.log("marker selected")}
                  onDeselect={() => console.log("marker deselected")}
              >
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
          {/*<TouchableOpacity
            onPress={() => this.props.complete()}
            style={styles.primaryButton}
          >
            <Text>Done</Text>
          </TouchableOpacity>*/}
        </View>
        {this.state.showProgress && <ActivityIndicator
            animating={this.state.showProgress}
            size="large"
            style={styles.loader}
          />}
      </View>
    );
  }
}

const mapStateToProps = (store) =>
{
  return {
    requestCount: store.requestCount
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: APIActions(dispatch)
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContainer);

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
        position: "absolute",
        top: 400,
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
      marginTop: 65,
      marginBottom: 400,
      height: 90,
      alignSelf: "stretch"
    },
    marker: {
      width: 25,
      height: 25,
    },
    journeyMarker: {

    },
    lunchMarker: {

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
