//
//  JSAlarmControllerBridge.m
//  BlankReactNativeProject
//
//  Created by Joey on 27/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(JSAlarmController, NSObject)

RCT_EXTERN_METHOD(saveEditAlarm:(NSString *)alarmID alarmDetails:(NSDictionary *)alarmDetails isEditMode:(BOOL)isEditMode callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(deleteAlarm:(NSString *)alarmID callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(testMe:(NSString *)text callback:(RCTResponseSenderBlock)callback)
@end
