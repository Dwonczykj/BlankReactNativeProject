/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
@import GoogleMobileAds;

@implementation AppDelegate : UIResponder, UIApplicationDelegate, AVAudioPlayerDelegate, AlarmApplicationDelegate
  

  var audioPlayer: AVAudioPlayer?
  let alarmScheduler: AlarmSchedulerDelegate = Scheduler()
  var alarmModel: Alarms = Alarms()

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize Google Mobile Ads SDK
  // Sample AdMob app ID: ca-app-pub-3940256099942544~1458002511
  [GADMobileAds configureWithApplicationID:@"ca-app-pub-3940256099942544~1458002511"];
  
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"BlankReactNativeProject"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:0.204f green:0.188f blue:0.275f alpha:0.92];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  return YES;
}

//receive local notification when app in foreground
- (void) application: (UIApplication*)application didReceive: (UILocalNotification*)notification
{
  //show an alert window
  const UIAlertController *storageController = [UIAlertController alertControllerWithTitle: @"Alarm"
                                                        message: nil
                                               preferredStyle:UIAlertControllerStyleAlert];
  bool isSnooze = false;
  NSString *soundName = @"";
  int index = -1;
  NSDictionary *userInfo = notification.userInfo;
  if (userInfo) {
    isSnooze = (bool)userInfo[@"snooze"];
    soundName = (NSString *)userInfo[@"soundName"];
    index = (int)userInfo[@"index"];
  }
  
//  playSound(soundName);
  //schedule notification for snooze
//  if isSnooze {
//    let snoozeOption = UIAlertAction(title: "Snooze", style: .default) {
//      (action:UIAlertAction)->Void in self.audioPlayer?.stop()
//      self.alarmScheduler.setNotificationForSnooze(snoozeMinute: 9, soundName: soundName, index: index)
//    }
//    storageController.addAction(snoozeOption)
//  }
  UIAlertAction *stopOption = [UIAlertAction
                                actionWithTitle:NSLocalizedString(@"OK", @"OK action")
                               style:UIAlertActionStyleCancel handler:^(UIAlertAction * action) {
                                 if(self.audioPlayer != [NSNull null])self.audioPlayer.stop();
    [self AudioServicesRemoveSystemSoundCompletion:kSystemSoundID_Vibrate];
    self.alarmModel = Alarms();
    self.alarmModel.alarms[index].onSnooze = false;
    //change UI
    MainAlarmViewController* mainVC = (MainAlarmViewController*)self.window?.visibleViewController
    if (mainVC == nil){
      let storyboard = [UIStoryboard storyboardWithName:@"Main" bundle:nil];
      mainVC = storyboard.instantiateViewController(withIdentifier: "Alarm") as? MainAlarmViewController
    }
    mainVC!.changeSwitchButtonState(index: index)
                               }];
  
  storageController.addAction(stopOption)
  window?.visibleViewController?.navigationController?.present(storageController, animated: true, completion: nil)
}

//snooze notification handler when app in background
func application(_ application: UIApplication, handleActionWithIdentifier identifier: String?, for notification: UILocalNotification, completionHandler: @escaping () -> Void) {
  var index: Int = -1
  var soundName: String = ""
  if let userInfo = notification.userInfo {
    soundName = userInfo["soundName"] as! String
    index = userInfo["index"] as! Int
  }
  self.alarmModel = Alarms()
  self.alarmModel.alarms[index].onSnooze = false
  if identifier == Id.snoozeIdentifier {
    alarmScheduler.setNotificationForSnooze(snoozeMinute: 9, soundName: soundName, index: index)
    self.alarmModel.alarms[index].onSnooze = true
  }
  completionHandler()
}

//print out all registed NSNotification for debug
func application(_ application: UIApplication, didRegister notificationSettings: UIUserNotificationSettings) {
  
  print(notificationSettings.types.rawValue)
}


//UIApplicationDelegate protocol
- (void)applicationWillResignActive:(UIApplication *)application {
//func applicationWillResignActive(_ application: UIApplication) {
  // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
  // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
  //        audioPlayer?.pause()
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
//func applicationDidEnterBackground(_ application: UIApplication) {
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
//func applicationWillEnterForeground(_ application: UIApplication) {
  // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
//func applicationDidBecomeActive(_ application: UIApplication) {
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  //        audioPlayer?.play()
  alarmScheduler.checkNotification()
}

- (void)applicationWillTerminate:(UIApplication *)application {
//func applicationWillTerminate(_ application: UIApplication) {
  // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
