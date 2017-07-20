//
//  LocalNotificatorBridge.m
//  BlankReactNativeProject
//
//  Created by Joey on 20/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LocalNotificator, NSObject)

RCT_EXTERN_METHOD(requestPermissions)
RCT_EXTERN_METHOD(checkPermissions:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(scheduleLocalNotification:(NSDictionary *)notificationData callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(cancelLocalNotification:(NSString *)uuid)

@end
