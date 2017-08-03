import React, { Component } from 'react';
import {
  AlertIOS,
  AppRegistry,
  NativeModules,
  NativeEventEmitter,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';

export default class MPMediaPlayer extends Component {
  constructor(props) {
        super(props);
        this.state = this.getInitialState();

    }

    getInitialState(){
      return {
        songPlaying : 'None'
      }
    }

    componentDidMount() {
        // Add Event Listener for SongPlaying event from MediaController
        const myMPMediaPickerEvnt = new NativeEventEmitter(NativeModules.MediaViewController);
        myMPMediaPickerEvnt.addListener('SongPlaying', (songName) => {
          this.setState({songPlaying : songName});
          console.log(`Song Playing with name ${songName}`);
        },this);

        debugger;

        // React.NativeAppEventEmitter.addListener('SongPlaying', (songName) => {
        //   this.setState({songPlaying : songName});
        //   console.log(`Song Playing with name ${songName}`);
        // });

        NativeModules.MediaViewController.showSounds();
    }

    render() {
      return (<View>
        <Text> Hey </Text>
      </View>);
    }
}
