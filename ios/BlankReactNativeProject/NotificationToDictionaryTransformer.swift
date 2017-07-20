//
//  NotificationToDictionaryTransformer.swift
//  BlankReactNativeProject
//
//  Created by Joey on 20/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

class NotificationToDictionaryTransformer {
  var notification: UILocalNotification
  
  init(notification: UILocalNotification) {
    self.notification = notification
  }
  
  func transform() -> [String: AnyObject] {
    var data = [String: AnyObject]()
    data["hasAction"] = notification.hasAction
    
    if let alertBody = notification.alertBody {
      data["alertBody"] = alertBody
    }
    
    if let fireDate = notification.fireDate {
      data["fireDate"] = fireDate.timeIntervalSince1970
    }
    
    if let userInfo = notification.userInfo {
      data["userInfo"] = userInfo
    }
    
    if let alertAction = notification.alertAction {
      data["alertAction"] = alertAction
    }
    
    if let alertTitle = notification.alertTitle {
      data["alertTitle"] = alertTitle
    }
    
    if let alertTitle = notification.alertTitle {
      data["alertTitle"] = alertTitle
    }
    
    return data
  }
}
