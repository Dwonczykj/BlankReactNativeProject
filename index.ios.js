/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
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
      isLoggedIn: false
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
        <Login onLogin={this.onLogin} />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
});

AppRegistry.registerComponent('BlankReactNativeProject', () => BlankReactNativeProject);
