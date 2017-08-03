//
//  AlarmSchedulerDelegate.swift
//  Alarm-ios-swift
//
//  Created by natsu1211 on 2017/02/01.
//  Copyright © 2017年 LongGames. All rights reserved.
//

import Foundation

protocol AlarmSchedulerDelegate {
    func setNotificationWithDate(_ date: Date, onWeekdaysForNotify:[Int], snoozeEnabled: Bool, onSnooze:Bool, soundName: String, id: String)
    //helper
    func setNotificationForSnooze(snoozeMinute: Int, soundName: String, id: String)
    func setupNotificationSettings()
    func reSchedule()
    func checkNotification()
}

