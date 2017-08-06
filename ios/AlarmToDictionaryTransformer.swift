//
//  AlarmToDictionaryTransformer.swift
//  BlankReactNativeProject
//
//  Created by Joey on 03/08/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

class AlarmToDictionaryTransformer {
  var alarm: Alarm
  
  init(alarm: Alarm) {
    self.alarm = alarm
  }
  
  func transform() -> [String: AnyObject] {
    
    var data = [String: AnyObject]()
    
    data["date"] = alarm.date.timeIntervalSince1970 as AnyObject
    data["enabled"] = alarm.enabled as AnyObject
    data["snoozeEnabled"] = alarm.snoozeEnabled as AnyObject
    data["repeatWeekdays"] = alarm.repeatWeekdays as AnyObject
    data["uuid"] = alarm.uuid as AnyObject
    data["mediaID"] = alarm.mediaID as AnyObject
    data["mediaLabel"] = alarm.mediaLabel as AnyObject
    data["label"] = alarm.label as AnyObject
    data["onSnooze"] = alarm.onSnooze as AnyObject
    
    
    return data
  }
}
