import React, { useMemo } from 'react'

import Svg, { Circle, Line } from 'react-native-svg'

const Stop = ({
    fill,
    height,
    radius,
    ...props
}: {
    fill: string
    [key: string]: any
}) => {
    return <Circle r={radius} cy={height} fill={fill} {...props} />
}

const translate = (cx: number, radius: number) => radius * 2 * (1 - cx) - radius

const Background = ({
    fill,
    stops,
    height,
    radius,
}: {
    fill: string
    stops: number
    height: number
    radius: number
}) => {
    const stopElements = useMemo(() => {
        let elements = [
            <Stop
                key={1}
                style={{ transform: { translateX: radius } }}
                cx={0}
                {...{ fill, height, radius }}
            />,
            <Stop
                key={2}
                style={{ transform: { translateX: radius * -1 } }}
                cx={'100%'}
                {...{ fill, height, radius }}
            />,
        ]
        for (let i = 1; i < stops - 1; i++) {
            const cx = i / (stops - 1)
            const translateX = translate(cx, radius)
            console.log(cx, translateX)
            elements.push(
                <Stop
                    key={i}
                    cx={`${cx * 100}%`}
                    style={{ transform: { translateX } }}
                    {...{ fill, height, radius }}
                />,
            )
        }
        return elements
    }, [stops, fill, height, radius])
    return (
        <Svg
            width="100%"
            height={height * 2}
            style={{
                overflow: 'visible',
                position: 'absolute',
            }}
        >
            <Line x1="0" y1={height} x2="100%" y2={height} stroke={fill} />
            {stopElements}
        </Svg>
    )
}

export { Background }
