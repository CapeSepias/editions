//
//  Ophan.swift
//  RnAppWithKotlin
//
//  Created by Max Spencer on 26/06/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

/**
* IMPORTANT
* Currently ophan doesn't support ARM architectures
* In lieu of this we've made this module a NOOP
* This can be commented out after Max has published the
* additional binaries to bin tray
*/

import Foundation
import ophan

@objc(Ophan)
class Ophan: NSObject {
  
  let ophanApi: OphanApi

  override init() {
    print("Initialising new Ophan instance on thread \(Thread.current)")
    
    let appVersion = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? ""
    let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? ""
    
    // TODO: Antonio has an objective-C snippet for this but I need his help to turn it into Swiftt
    let deviceName = "Unknown"
    
    ophanApi = OphanKt_.getThreadSafeOphanApi (
      appFamily: "iOS Editions",
      appVersion: appVersion + " (" + buildNumber + ")",
      appOsVersion: UIDevice.current.systemVersion,
      deviceName: deviceName,
      deviceManufacturer: "Apple",
      deviceId: "testDeviceId",
      userId: "testUserId",
      logger: SimpleLogger(),
      recordStorePath: "ophan"
    )
    
    super.init()
  }

  deinit {
    print("Deinitialising Ophan instance on thread \(Thread.current)")
  }

  @objc(sendTestAppScreenEvent:resolver:rejecter:)
  func sendTestAppScreenEvent(_ screenName: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject:RCTPromiseRejectBlock) -> Void {
    print("Current thread \(Thread.current)")
    do {
      DispatchQueue.main.async {
      print("Current thread \(Thread.current)")
        self.ophanApi.sendTestAppScreenEvent(screenName: screenName, eventId: UUID().uuidString)
        resolve(screenName)
      }
    } catch let error {
      reject("whoops - ios Ophan is sad", "blah", nil)
    }
  }
}

class SimpleLogger: Multiplatform_ophanLogger {
  func debug(tag: String, message: String) {
    print("D: " + tag + ": " + message + "\n")
  }
  
  func warn(tag: String, message: String, error: KotlinThrowable?) {
    print("W: " + tag + ": " + message + "\n")
  }
}
