//
//  JSEventEmitter.m
//  BlankReactNativeProject
//
//  Created by Joey on 20/07/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(JSEventEmitter, RCTEventEmitter<RCTBridgeModule>)

RCT_EXTERN_METHOD(tellJS)
RCT_EXTERN_METHOD(tellJSWithBody:(NSString *)SoundName)
//RCT_EXTERN_METHOD(emitEvent:(NSString *)eventName eventBody: (NSDictionary *)eventBody)
//RCT_EXTERN_METHOD(tellJS:(UIApplication *)application eventName(NSString *)eventName notification:(UILocalNotification)notification)
@end
