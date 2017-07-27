//
//  EventEmitter.swift
//  BlankReactNativeProject
//
//  Created by Joey on 20/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

@objc(JSEventEmitter)
class JSEventEmitter: RCTEventEmitter {
  
  @objc override func supportedEvents() -> [String]! {
    return ["sayHello", "didReceiveLocalNotification"];
  }
  
  @objc func tellJS() -> Void {
    self.sendEvent(withName: "sayHello", body: "Hello from the body")
  }
  
//  @objc(tellJS:eventName:notification:) static func tellJS(application: UIApplication, eventName: String, notification: UILocalNotification) -> Void {
//    self.sendEvent(withName: eventName, body: NotificationToDictionaryTransformer(notification: notification).transform())
//  }
  
}
