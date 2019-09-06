import {
    setUserId,
    sendAppScreenEvent,
    sendComponentEvent,
    sendPageViewEvent,
    ComponentType,
    Action,
} from '../ophan'
import { NativeModules } from 'react-native'

jest.mock('NativeModules', () => ({
    Ophan: {
        setUserId: jest.fn(),
        sendAppScreenEvent: jest.fn(),
        sendComponentEvent: jest.fn(),
        sendPageViewEvent: jest.fn(),
    },
}))

describe('services/ophan', () => {
    describe('setUserId', () => {
        it('should use the correct native module function', () => {
            setUserId('12345qwerty')
            expect(NativeModules.Ophan.setUserId).toHaveBeenCalled()
            expect(NativeModules.Ophan.setUserId).toHaveBeenCalledWith(
                '12345qwerty',
            )
        })
    })

    describe('sendAppScreenEvent', () => {
        it('should use the correct native module function at a basic level', () => {
            sendAppScreenEvent({ screenName: 'issue_front' })
            expect(NativeModules.Ophan.sendAppScreenEvent).toHaveBeenCalled()
            expect(NativeModules.Ophan.sendAppScreenEvent).toHaveBeenCalledWith(
                'issue_front',
                undefined,
            )
        })

        it('should use the correct native module function with optional values', () => {
            sendAppScreenEvent({
                screenName: 'issue_front',
                value: '2019-08-30',
            })
            expect(NativeModules.Ophan.sendAppScreenEvent).toHaveBeenCalled()
            expect(NativeModules.Ophan.sendAppScreenEvent).toHaveBeenCalledWith(
                'issue_front',
                '2019-08-30',
            )
        })
    })

    describe('sendComponentEvent', () => {
        it('should use the correct native module function with basic values', () => {
            sendComponentEvent({
                componentType: ComponentType.appVideo,
                action: Action.view,
            })
            expect(NativeModules.Ophan.sendComponentEvent).toHaveBeenCalled()
            expect(NativeModules.Ophan.sendComponentEvent).toHaveBeenCalledWith(
                ComponentType.appVideo,
                Action.view,
                undefined,
                undefined,
            )
        })

        it('should use the correct native module function with optional values', () => {
            sendComponentEvent({
                componentType: ComponentType.appVideo,
                action: Action.view,
                value: 'youtube/politicalvideo',
                componentId: '12345qwerty',
            })
            expect(NativeModules.Ophan.sendComponentEvent).toHaveBeenCalled()
            expect(NativeModules.Ophan.sendComponentEvent).toHaveBeenCalledWith(
                ComponentType.appVideo,
                Action.view,
                'youtube/politicalvideo',
                '12345qwerty',
            )
        })
    })

    describe('sendPageViewEvent', () => {
        it('should use the correct native module function', () => {
            sendPageViewEvent({
                path: 'uk/politics/no-deal-brexit',
            })
            expect(NativeModules.Ophan.sendPageViewEvent).toHaveBeenCalled()
            expect(NativeModules.Ophan.sendPageViewEvent).toHaveBeenCalledWith(
                'uk/politics/no-deal-brexit',
            )
        })
    })
})
