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
//  var snoozeEnabled: Bool = false
//  var enabled: Bool!
  
  @objc func saveEditAlarm(alarmID: String, alarmDetails: [String: AnyObject], isEditMode: Bool, callback: RCTResponseSenderBlock) {
    
    var tempAlarm = Alarm()
    tempAlarm.date = alarmDetails["date"] as! Date
    tempAlarm.label = alarmDetails["label"] as! String
    tempAlarm.enabled = true
    tempAlarm.mediaLabel = segueInfo.mediaLabel
    tempAlarm.mediaID = segueInfo.mediaID
    tempAlarm.snoozeEnabled = alarmDetails["snoozeEnabled"] as! Bool
    tempAlarm.repeatWeekdays = segueInfo.repeatWeekdays
    tempAlarm.uuid = UUID().uuidString
    tempAlarm.onSnooze = false
    if isEditMode {
      alarmModel.alarms[alarmID] = tempAlarm
      //update alarms from an array to a dictionary and then get an alarm by its id, not its index.
    }
    else {
      alarmModel.alarms.append(tempAlarm)
    }
    
    //Emit the alarm details so that can be passed into the store.
    callback([tempAlarm])
  }
  
  


}
