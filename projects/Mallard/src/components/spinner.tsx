import React, { useState, useEffect } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { ariaHidden } from 'src/helpers/a11y'
import { color } from 'src/theme/color'

const styles = StyleSheet.create({
    ball: {
        width: 22,
        height: 22,
        margin: 2,
        borderRadius: 100,
    },
    container: { flexDirection: 'row' },
})

const pillars = [
    color.palette.news.main,
    color.palette.opinion.main,
    color.palette.sport.main,
    color.palette.culture.main,
    color.palette.lifestyle.main,
]

const Ball = ({ color, jump }: { color: string; jump: Animated.Value }) => {
    return (
        <Animated.View
            style={[
                styles.ball,
                { backgroundColor: color },
                {
                    transform: [
                        {
                            translateY: jump.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-5, 5],
                            }),
                        },
                    ],
                },
            ]}
        ></Animated.View>
    )
}

const animateJumps = (value: Animated.Value, delay = 0) => {
    const duration = 400
    const useNativeDriver = true
    return Animated.sequence([
        Animated.delay(200 * delay),
        Animated.loop(
            Animated.sequence([
                Animated.timing(value, {
                    toValue: 1,
                    duration,
                    useNativeDriver,
                }),
                Animated.timing(value, {
                    toValue: 0,
                    duration,
                    useNativeDriver,
                }),
                Animated.timing(value, {
                    toValue: 1,
                    duration,
                    useNativeDriver,
                }),
            ]),
        ),
    ])
}

const Spinner = () => {
    const [jumps] = useState(() => [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ])
    useEffect(() => {
        Animated.parallel(jumps.map((j, i) => animateJumps(j, i))).start()
    }, [])
    return (
        <View accessibilityLabel={'Loading content'}>
            <View {...ariaHidden} style={styles.container}>
                {pillars.map((color, index) => (
                    <Ball key={index} jump={jumps[index]} color={color}></Ball>
                ))}
            </View>
        </View>
    )
}

export { Spinner }
