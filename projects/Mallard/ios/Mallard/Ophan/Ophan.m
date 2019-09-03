//
//  Ophan.m
//  RnAppWithKotlin
//
//  Created by Max Spencer on 25/06/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(Ophan, NSObject)

RCT_EXTERN_METHOD(sendTestAppScreenEvent: (NSString)screenName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(setUserId: (NSString)userId)
                  

@end
