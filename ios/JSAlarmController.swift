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
  
  @objc(saveEditAlarm:alarmDetails:isEditMode:callback:) func saveEditAlarm(alarmID: String, alarmDetails: [String: AnyObject], isEditMode: Bool, callback: RCTResponseSenderBlock) -> Void {
    
    var tempAlarm = Alarm()
//    tempAlarm.date = RCTConvert.nsDate()
    if let fireDate = alarmDetails["time"] {
      tempAlarm.date = RCTConvert.nsDate(fireDate)
    }
    tempAlarm.label = alarmDetails["label"] as! String
    tempAlarm.enabled = true
    tempAlarm.mediaLabel = "bell"//alarmDetails["mediaLabel"] as! String
    tempAlarm.mediaID = "alarm1"//alarmDetails["mediaID"] as! String
    tempAlarm.snoozeEnabled = false//alarmDetails["snoozeEnabled"] as! Bool
    tempAlarm.repeatWeekdays = []//[alarmDetails["repeatWeekdays"] as! Int]
    tempAlarm.uuid = UUID().uuidString
    tempAlarm.onSnooze = false
    
    if isEditMode {
      tempAlarm.uuid = alarmID
      alarmModel.alarms[alarmID] = tempAlarm
      alarmScheduler.reSchedule()
      //update alarms from an array to a dictionary and then get an alarm by its id, not its index.
    }
    else {
//      alarmModel.alarms.append(tempAlarm)
      alarmModel.alarms[tempAlarm.uuid] = tempAlarm
      alarmScheduler.setNotificationWithDate(alarmModel.alarms[tempAlarm.uuid]!.date, onWeekdaysForNotify: alarmModel.alarms[tempAlarm.uuid]!.repeatWeekdays, snoozeEnabled: alarmModel.alarms[tempAlarm.uuid]!.snoozeEnabled, onSnooze: false, soundName: alarmModel.alarms[tempAlarm.uuid]!.mediaLabel, id: tempAlarm.uuid)
    }
    
    //Emit the alarm details so that can be passed into the store.
    callback([alarmDetails])
    
    return;
  }
  
  @objc(deleteAlarm:callback:) func deleteAlarm(alarmID: String,callback: RCTResponseSenderBlock) -> Void {
//    alarmModel.alarms.remove(alarmWithID: alarmID)
    let removedAlarm = alarmModel.alarms.removeValue(forKey: alarmID)
    callback([removedAlarm?.uuid ?? ""])
  }
  
  @objc(testMe:callback:) func testMe(text: String,callback: RCTResponseSenderBlock) {
    print(text)
    callback([])
    return;
  }


}
