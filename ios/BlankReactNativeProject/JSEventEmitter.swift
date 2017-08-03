//
//  EventEmitter.swift
//  BlankReactNativeProject
//
//  Created by Joey on 20/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation

//I Dont think any of this module needs/should be sent over the bridge as this goes only from swift -> js
@objc(JSEventEmitter)
class JSEventEmitter: RCTEventEmitter {
  
  //The list of available events
  override func supportedEvents() -> [String]! {
    return ["sayHello", "didReceiveLocalNotification"];
  }
  
  @objc func tellJS() -> Void {
    self.sendEvent(withName: "sayHello", body: "Hello from the body")
  }
  
  @objc(tellJSWithBody:) func tellJSWithBody(SoundName:String) -> Void {
    self.sendEvent(withName: "sayHello", body: SoundName)
  }
  
  //this is the static function that we can call from our code.
  /*@objc(emitEvent:eventBody:) */static func emitEvent(eventName: String,eventBody: [String:AnyObject]) -> Void {
    let eventDetail = ["name":eventName, "body":eventBody] as [String : Any]
    NotificationCenter.default.post(name: NSNotification.Name(rawValue: "event-emitted-internal-flag"), object: self, userInfo: eventDetail)
  }
  
  //this will actually throw the event to the js.
  @objc(emitEventInternal:) private func emitEventInternal(notification: Notification) -> Void {
    let eventDetail = notification.userInfo
    let eventName = eventDetail!["name"] as! String
    let eventBody = eventDetail?["body"]
    self.sendEvent(withName: eventName, body: eventBody)
  }
  
  //This function listens for the events we want to send out and will then pass 
  //the payload over to the emitEventInternal function for sending to JS.
  override func startObserving() {
    NotificationCenter.default.addObserver(self, selector: #selector(self.emitEventInternal(notification:)), name: NSNotification.Name(rawValue: "event-emitted-internal-flag"), object: nil)
    
  }
  
  //stop listenening for events if need be.
  override func stopObserving() {
    NotificationCenter.default.removeObserver(self)
  }
  
}
