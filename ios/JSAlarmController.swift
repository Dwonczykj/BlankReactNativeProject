//
//  JSAlarmController.swift
//  BlankReactNativeProject
//
//  Created by Joey on 27/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

@objc(JSAlarmController)
class JSAlarmController: NSObject {
  
  var alarmScheduler: AlarmSchedulerDelegate = Scheduler()
  var alarmModel: Alarms = Alarms()
  var snoozeEnabled: Bool = false
  var enabled: Bool!
  
  @objc override func supportedEvents() -> [String]! {
    return ["sayHello", "didReceiveLocalNotification"];
  }
  
  @objc func saveEditAlarm(alarmDetails: [String: AnyObject]) {
    
    var tempAlarm = Alarm()
    tempAlarm.date = alarmDetails["date"] as! Date
    tempAlarm.label = alarmDetails["label"] as! String
    tempAlarm.enabled = true
    tempAlarm.mediaLabel = segueInfo.mediaLabel
    tempAlarm.mediaID = segueInfo.mediaID
    tempAlarm.snoozeEnabled = snoozeEnabled
    tempAlarm.repeatWeekdays = segueInfo.repeatWeekdays
    tempAlarm.uuid = UUID().uuidString
    tempAlarm.onSnooze = false
    if segueInfo.isEditMode {
      alarmModel.alarms[index] = tempAlarm
    }
    else {
      alarmModel.alarms.append(tempAlarm)
    }
    self.performSegue(withIdentifier: Id.saveSegueIdentifier, sender: self)
  }


}
