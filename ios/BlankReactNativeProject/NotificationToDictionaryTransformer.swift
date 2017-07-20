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
    data["hasAction"] = notification.hasAction as AnyObject
    
    if let alertBody = notification.alertBody {
      data["alertBody"] = alertBody as AnyObject
    }
    
    if let fireDate = notification.fireDate {
      data["fireDate"] = fireDate.timeIntervalSince1970 as AnyObject
    }
    
    if let userInfo = notification.userInfo {
      data["userInfo"] = userInfo as AnyObject
    }
    
    if let alertAction = notification.alertAction {
      data["alertAction"] = alertAction as AnyObject
    }
    
    if let alertTitle = notification.alertTitle {
      data["alertTitle"] = alertTitle as AnyObject
    }
    
    if let alertTitle = notification.alertTitle {
      data["alertTitle"] = alertTitle as AnyObject
    }
    
    return data
  }
}
