import React, { createContext, useContext } from 'react'
import { Animated } from 'react-native'
import { NavigationContainer, NavigationInjectedProps } from 'react-navigation'
import { addStaticRouter } from './base'

export const minScale = 0.9
export const minOpacity = 0.9
export const radius = 20

export interface PositionInjectedProps {
    position: Animated.Value
}

const PositionContext = createContext(new Animated.Value(0))
export const useNavigatorPosition = () => useContext(PositionContext)

export type NavigatorWrapper = (
    Navigator: NavigationContainer,
    getPosition: () => Animated.Value,
) => NavigationContainer

export const addStaticRouterWithPosition: NavigatorWrapper = (
    Navigator,
    getPosition,
) => {
    const WithPosition = ({ navigation }: NavigationInjectedProps) => {
        const position = getPosition()
        return (
            <PositionContext.Provider value={position}>
                <Navigator navigation={navigation} />
            </PositionContext.Provider>
        )
    }

    return addStaticRouter(Navigator, WithPosition)
}
