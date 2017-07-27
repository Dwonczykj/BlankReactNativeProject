/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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

import Login from './Login';
import AppContainer from './AppContainerNoTabs';
import {getAuthInfo} from './AuthService';

export default class BlankReactNativeProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingAuth: true,
      isLoggedIn: false,
      lastNotification: null
    }
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount() {
    getAuthInfo((err, authInfo) => {
      this.setState({
        checkingAuth: false,
        isLoggedIn: authInfo != null
      })
    });


    this.didReceiveLocalNotification = (notification) => {
        AlertIOS.alert(notification.userInfo.message);
        this.setState({lastNotification: null});
    };
    NativeModules.LocalNotificator.testMe("Hey");
    // NativeModules.LocalNotificator.checkPermissions((arr) => console.log(arr));
    // const myModuleEvnt = new NativeEventEmitter(NativeModules.JSEventEmitter);
    // myModuleEvnt.addListener('sayHello', (data) => console.log(data));
    // myModuleEvnt.addListener('didReceiveLocalNotification', (data) => this.didReceiveLocalNotification(data))


    // React.NativeAppEventEmitter.addListener('didReceiveLocalNotification', this.didReceiveLocalNotification);
  }

  generateNotification() {
  	let date = new Date;
  	NativeModules.LocalNotificator.scheduleLocalNotification({
          alertBody: 'The body',
          fireDate: date.getTime() + 1000 * 15,
          alertAction: 'View',
          alertTitle: 'The title',
          userInfo: {
              UUID: this.lastNotification,
              message: 'Created at: ' + date.toString()
          }
      }, (notificationData) => {
          console.log(notificationData);
          //Display the notification if you want.
          this.setState({lastNotification: notificationData});

      });
  }

  cancelNotification() {
      NativeModules.LocalNotificator.cancelLocalNotification(this.state.lastNotification.userInfo.UUID);
      this.setState({lastNotification: null});
  }

  getCancelNotificationButton() {
  	return (
  		<TouchableOpacity onPress={() => this.cancelNotification()} style={[styles.button, styles.errorButton]}>
  		<Text>Cancel Notification</Text>
  		</TouchableOpacity>
  	);
  }

  getGenerateNotificationButton() {
  	return (
  		<TouchableOpacity onPress={() => this.generateNotification()} style={styles.button}>
  		  <Text>Generate New Notification</Text>
  		</TouchableOpacity>
  	);
  }

  onLogin(){
    this.setState({isLoggedIn: true});
  }

  render() {
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>
    //       Welcome to React Native!
    //     </Text>
    //     <Text style={styles.instructions}>
    //       To get started, edit index.ios.js
    //     </Text>
    //     <Text style={styles.instructions}>
    //       Press Cmd+R to reload,{'\n'}
    //       Cmd+D or shake for dev menu
    //     </Text>
    //   </View>
    // );
    if(this.state.checkingAuth){
      return (
        <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loader} />
        </View>
      );
    }

    if(this.state.isLoggedIn){
      return (
        <AppContainer />
      );
    }else{
      return (

        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.generateNotification()} style={styles.button}>
            <Text>Generate New Notification</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

// <Login onLogin={this.onLogin} />

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(52, 48, 70, 0.92)",
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  loader: {
  },
  button: {
    height: 50,
    maxWidth: 300,
    minWidth: 300,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  }
});

// request permissions
NativeModules.LocalNotificator.requestPermissions();

AppRegistry.registerComponent('BlankReactNativeProject', () => BlankReactNativeProject);
