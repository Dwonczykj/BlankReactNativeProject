import React from 'react';
import MapContainer from './mapContainer';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class JourneyTimerContainer extends React.Component {
  constructor(props){
    super(props)

    this.state= {
      start: 0,
      end: 0,
      showProgress: false,
      error: "",
      journeyTime: -1
    }

    this.calcJourneyTime = this.calcJourneyTime.bind(this);
    this.addStartMarker = this.addStartMarker.bind(this);
    this.addEndMarker = this.addEndMarker.bind(this);
    this.startMarkerAdded = this.startMarkerAdded.bind(this);
    this.endMarkerAdded = this.endMarkerAdded.bind(this);
  }

  calcJourneyTime(){
    let request = `https://developer.citymapper.com/api/1/traveltime/?startcoord=${this.state.start.latitude},${this.state.start.longitude}&endcoord=${this.state.end.latitude},${this.state.end.longitude}&key=775a1097e1a1565c121e594df7b9387b`;
    this.setState({showProgress: true});

    fetch(request)
      .then((response)=> {
        debugger;
          if(response.status >= 200 && response.status < 300){
              return response;
          }

          throw {
              badCredentials: response.status == 401,
              unknownError: response.status != 401
          }
      })
      .then((response)=> {
          return response.json();
      })
      .then((results)=> {
          debugger;
          this.setState({journeyTime: results["travel_time_minutes"],showProgress:false})
      })
      .catch((err)=> {
        debugger;
          this.setState({showProgress: false, error: err});
          return cb(err);
      });
  }

  startMarkerAdded(coordinate){
    debugger;
    this.props.navigator.pop();
    this.setState({start: coordinate});
  }

  endMarkerAdded(coordinate){
    debugger;
    this.props.navigator.pop();
    this.setState({end: coordinate});
  }

  addStartMarker(){
    this.props.navigator.push({
        title: 'Start Coordinate',
        component: MapContainer,
        passProps: {onPress: this.startMarkerAdded}
        // passProps: { data: 'some-data' },
    });

  }

  addEndMarker(){
    this.props.navigator.push({
        title: 'End Coordinate',
        component: MapContainer,
        passProps: {onPress: this.endMarkerAdded}
    });
  }

  render(){
    return (
      <View>
        <Text style={styles.heading}>Journey Timer</Text>
        <TextInput
            onChangeText={(text)=> this.setState({start: text})}
            style={styles.loginInput}
            placeholder="Start Coordinate">
        </TextInput>
        <TextInput
            onChangeText={(text)=> this.setState({end: text})}
            style={styles.loginInput}
            placeholder="End Coordinate">
        </TextInput>
        <TouchableHighlight
            onPress={this.addStartMarker}
            style={styles.button}>
            <Text style={styles.buttonText}>Add Start</Text>
        </TouchableHighlight>
        <TouchableHighlight
            onPress={this.addEndMarker}
            style={styles.button}>
            <Text style={styles.buttonText}>Add End</Text>
        </TouchableHighlight>
        <TouchableHighlight
            onPress={this.calcJourneyTime}
            style={styles.button}>
            <Text style={styles.buttonText}>Calculate Journey</Text>
        </TouchableHighlight>
        <Text style={styles.success}>{this.state.journeyTime}</Text>
        <Text style={styles.error}>{this.state.error}</Text>
        {this.state.showProgress && <ActivityIndicator
            animating={this.state.showProgress}
            size="large"
            style={styles.loader}
            />}
      </View>
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
        fontSize: 30,
        margin: 10,
        marginBottom: 20
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
    success: {
        color: 'green',
        paddingTop: 10
    },
    error: {
        color: 'red',
        paddingTop: 10
    }
});

export default JourneyTimerContainer;
