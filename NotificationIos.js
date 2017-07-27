import {
  AlertIOS,
  NativeModules,
  NativeEventEmitter
} from 'react-native';

export function generateNotification() {
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

export function cancelNotification() {
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
