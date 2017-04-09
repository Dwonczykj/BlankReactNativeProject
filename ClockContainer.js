import React from 'react';
import AnalogClock from 'react-native-analog-clock';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'

export default class extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      date: new Date(),
      alarm1: null,
      ringAlarm: true
    }
    this.addAlarm = this.addAlarm.bind(this);
    this.stopAlarm = this.stopAlarm.bind(this);
  }

  // componentDidMount(){
  //   //TODO: Add this.setInterval so that the Clock stops when the component unmounts.
  //   setInterval( () => {
  //     this.setState({
  //       curTime : new Date().toLocaleString()
  //     })
  //   },1000)
  // }
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    console.log(this.state.alarm1);
    console.log(this.state.date);
    if(this.state.alarm1 && this.state.date.getTime() == this.state.alarm1.getTime())
    {
      debugger;
      return this.setState({
        date: new Date(),
        ringAlarm: true
      });
    } else {
      this.setState({
        date: new Date(),
      });
    }
  }

  addAlarm(date){
    let t = new Date();
    const parsedDate = new Date(t.getTime() + 10000);//t.setSeconds(t.getSeconds() + 10);
    this.setState({alarm1: parsedDate});
    console.log(`alarm added for ${parsedDate}`)
  }

  stopAlarm(){
    this.setState({
      ringAlarm: false
    })
  }

  render(){
      //NOTE: state should be initialized in your constructor (I just abbreviate)
      // const { demoConfigParameters } = this.state;
      // const { hours, minutes, seconds } = this.state;
      // const { currentHours, currentMinutes, currentSeconds } = this.state;
      // const { enableShadows, realTime, militaryTime, currentTime, enableDigit, setTimeViaTouch, enableGraduations, enableHub } = this.state;
      // const { borderColor, borderWidth, borderAlpha } = this.state;
      // const { digitOffset, digitColor } = this.state;
      // const { faceBackgroundColor, faceBackgroundAlpha } = this.state;
      // const { hourHandColor, hourHandAlpha, hourHandWidth, hourHandLength, hourHandOffsideLength } = this.state;
      // const { minuteHandColor, minuteHandAlpha, minuteHandWidth, minuteHandLength, minuteHandOffsideLength } = this.state;
      // const { secondHandColor, secondHandAlpha, secondHandWidth, secondHandLength, secondHandOffsideLength } = this.state;
      // const { hubColor, hubAlpha, hubRadius } = this.state;
      // const { accentGraduationModulo, bridgeHighGraduationColor, bridgeSmallGraduationColor, highGraduationWidth, smallGraduationWidth, highGraduationLength, smallGraduationLength } = this.state;
      // return (
      //   <AnalogClock
      //     ref={(ref)=>{this.analogClock = ref;}}
      //     style={{
      //       height: 140,
      //       width: 140,
      //       backgroundColor: 'transparent'}
      //     }
      //
      //     hours={hours}
      //     minutes={minutes}
      //     seconds={seconds}
      //     enableShadows={enableShadows}
      //     realTime={realTime}
      //     militaryTime={militaryTime}
      //     currentTime={currentTime}
      //     enableDigit={enableDigit}
      //     setTimeViaTouch={setTimeViaTouch}
      //     enableGraduations={enableGraduations}
      //     enableHub={enableHub}
      //     borderColor={borderColor}
      //     borderAlpha={borderAlpha}
      //     borderWidth={borderWidth}
      //     digitColor={digitColor}
      //     digitOffset={digitOffset}
      //     faceBackgroundColor={faceBackgroundColor}
      //     faceBackgroundAlpha={faceBackgroundAlpha}
      //
      //     hourHandColor={hourHandColor}
      //     hourHandAlpha={hourHandAlpha}
      //     hourHandWidth={hourHandWidth}
      //     hourHandLength={hourHandLength}
      //     hourHandOffsideLength={hourHandOffsideLength}
      //
      //     minuteHandColor={minuteHandColor}
      //     minuteHandAlpha={minuteHandAlpha}
      //     minuteHandWidth={minuteHandWidth}
      //     minuteHandLength={minuteHandLength}
      //     minuteHandOffsideLength={minuteHandOffsideLength}
      //
      //     secondHandColor={secondHandColor}
      //     secondHandAlpha={secondHandAlpha}
      //     secondHandWidth={secondHandWidth}
      //     secondHandLength={secondHandLength}
      //     secondHandOffsideLength={secondHandOffsideLength}
      //
      //     hubColor={hubColor}
      //     hubAlpha={hubAlpha}
      //     hubRadius={hubRadius}
      //
      //     accentGraduationModulo={accentGraduationModulo}
      //     highGraduationWidth={highGraduationWidth}
      //     smallGraduationWidth={smallGraduationWidth}
      //     highGraduationLength={highGraduationLength}
      //     smallGraduationLength={smallGraduationLength}
      //
      //     onTimeChange={
      //       ({hours, minutes, seconds}) => {
      //         this.setState({
      //           currentHours: hours,
      //           currentMinutes: minutes,
      //           currentSeconds: seconds
      //         });
      //       }
      //     }
      //   />
      // );

      return (
        <View
          style={styles.container}
        >
          <AnalogClock
            style={styles.clock}
            onTimeChange={
              ({hours, minutes, seconds}) => console.log(`time is now : ${hours}:${minutes}:${seconds}`)
            }
          />
          <TouchableHighlight
              onPress={() => console.log("Hey there Joey!")}
              style={styles.button}>
              <Text style={styles.buttonText}>Clock Me</Text>
          </TouchableHighlight>
          <Text style={styles.error}>It is {this.state.date.toLocaleString()}.</Text>
          <TouchableHighlight
              onPress={this.addAlarm}
              style={styles.button}>
              <Text style={styles.buttonText}>Add Alarm</Text>
          </TouchableHighlight>
          <TouchableHighlight
              onPress={this.stopAlarm}
              style={styles.button}>
              <Text style={styles.buttonText}>Stop Alarm</Text>
          </TouchableHighlight>
          {this.state.ringAlarm && <Text style={styles.error}>Alarm is ringing!!!</Text>}
        </View>
      );
  }
}

let styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        paddingTop: 100,
        padding: 10,
        alignItems: 'center',
        flex: 1
    },
    clock: {
        height: 150,
        width: 150,
        marginTop: 10,
        padding: 4,
        borderWidth: 1,
        backgroundColor: '#F5FCFF',
        borderColor: '#48BBEC',
        borderRadius: 0,
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
