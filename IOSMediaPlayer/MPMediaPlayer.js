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

        // const myMPMediaPickerEvnt = new NativeEventEmitter(NativeModules.MediaViewController);
        // Issue is that you can only addListener to a module that has an addListener function.
        // All modules which implement RCTEventEmitter will have an addListener method.
        // myMPMediaPickerEvnt.addListener('SongPlaying', (songName) => {
        //   this.setState({songPlaying : songName});
        //   console.log(`Song Playing with name ${songName}`);
        // },this);

        let nativeMod = new NativeEventEmitter(NativeModules.JSEventEmitter);
        nativeMod.addListener('sayHello',(soundName) => console.log(soundName));


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
