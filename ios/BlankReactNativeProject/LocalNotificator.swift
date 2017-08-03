//
//  LocalNotificator.swift
//  BlankReactNativeProject
//
//  Created by Joey on 20/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import UIKit


@objc(LocalNotificator)
class LocalNotificator: NSObject {
  
  @objc func requestPermissions() -> Void {
    if (RCTRunningInAppExtension()) {
      return;
    }
    
    let app: UIApplication = RCTSharedApplication()!
    let types: UIUserNotificationType = [.badge, .alert, .sound]
    
    let category = UIMutableUserNotificationCategory()
    category.identifier = "SwiftReactNativeCategory"
    
    let settings = UIUserNotificationSettings(types: types, categories: [category])
    
    app.registerUserNotificationSettings(settings)
    app.registerForRemoteNotifications()
  }
  
  @objc(testMe:) func testMe(text: String) {
    print(text)
  }
  
  @objc(checkPermissions:) func checkPermissions(callback: RCTResponseSenderBlock) -> Void {
    let defaultPermissions = ["alert": false, "badge": false, "sound": false]
    
    if (RCTRunningInAppExtension()) {
      callback([defaultPermissions]);
      return;
    }
    
    var types: UIUserNotificationType;
    if (UIApplication.instancesRespond(to: #selector(getter: UIApplication.currentUserNotificationSettings))) {
      if let settings = RCTSharedApplication()?.currentUserNotificationSettings {
        types = settings.types
        var permissions = [String: Bool]()
        permissions["alert"] = types.contains(.alert)
        permissions["badge"] = types.contains(.badge)
        permissions["sound"] = types.contains(.sound)
        
        callback([permissions]);
        return;
      }
    }
    
    callback([defaultPermissions]);
  }
  
  @objc(scheduleLocalNotification:callback:) func scheduleLocalNotification(notificationData: [String: AnyObject], callback: RCTResponseSenderBlock) -> Void {
    let notification = createLocalNotification(notificationData: notificationData)
    RCTSharedApplication()?.scheduleLocalNotification(notification)
    callback([NotificationToDictionaryTransformer(notification: notification).transform()]);
    return;
  }
  
  private func createNotification(notificationData: [String: AnyObject]) -> UILocalNotification {
    let notification = UILocalNotification()
    //notification.init
    notification.soundName = UILocalNotificationDefaultSoundName
    notification.alertBody = notificationData["alertBody"] as? String
    notification.alertAction = notificationData["alertAction"] as? String
    notification.alertTitle = notificationData["alertTitle"] as? String
    
    if let hasAction = notificationData["hasAction"] {
      notification.hasAction = (hasAction as? Bool)!
    }
    
    
    notification.category = "schedulerViewItemCategory"
    
    if let fireDate = notificationData["fireDate"] {
      notification.fireDate = RCTConvert.nsDate(fireDate)
    }
    
    let uuid = NSUUID().uuidString
    
    if let userInfo = notificationData["userInfo"] as? [NSObject : AnyObject]{
      notification.userInfo = userInfo
      notification.userInfo!["UUID"] = uuid
    } else {
      notification.userInfo = ["UUID": uuid]
    }
    
    return notification;
  }
  
  private func createLocalNotification(notificationData: [String: AnyObject]) -> UILocalNotification {
    let notification = UILocalNotification()
    notification.soundName = UILocalNotificationDefaultSoundName
    notification.alertBody = notificationData["alertBody"] as? String
    notification.alertAction = notificationData["alertAction"] as? String
    notification.alertTitle = notificationData["alertTitle"] as? String
    
    if let hasAction = notificationData["hasAction"] {
      notification.hasAction = (hasAction as? Bool)!
    }
    
//    notification.
    
    notification.category = "schedulerViewItemCategory"
    
    if let fireDate = notificationData["fireDate"] {
      notification.fireDate = RCTConvert.nsDate(fireDate)
    }
    
    let uuid = NSUUID().uuidString
    
    if let userInfo = notificationData["userInfo"] as? [NSObject : AnyObject]{
      notification.userInfo = userInfo
      notification.userInfo!["UUID"] = uuid
    } else {
      notification.userInfo = ["UUID": uuid]
    }
    
    return notification;
  }
  
  @objc(cancelLocalNotification:) func cancelLocalNotification(uuid: String) -> Void {
    for notification in (RCTSharedApplication()?.scheduledLocalNotifications)! {
      
      guard (notification.userInfo != nil) else {
        continue
      }
      
      guard notification.userInfo!["UUID"] as! String == uuid else {
        continue
      }
      RCTSharedApplication()?.cancelLocalNotification(notification)
      break
    }
  }
  
}
