import React, { ReactNode, useState } from 'react'
import { Animated, Dimensions, StyleSheet, View, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BlockElement } from 'src/common'
import { safeInterpolation } from 'src/helpers/math'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { ArticleHeader } from '../article-header'
import { ArticleHeaderProps } from '../article-header/types'
import { PropTypes as StandfirstPropTypes } from '../article-standfirst'
import { Wrap, WrapLayout } from '../wrap/wrap'
import { WebviewWithArticle } from './article/webview'
import {
    wireScrollBarToDismiss,
    OnTopPositionChangeFn,
} from 'src/screens/article/helpers'
import { UiBodyCopy } from 'src/components/styled-text'

const styles = StyleSheet.create({
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    webviewWrap: {
        ...StyleSheet.absoluteFillObject,
    },
    webview: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        /*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        */
        opacity: 0.99,
    },
})

const ArticleWebview = ({
    header,
    onTopPositionChange,
    ...webviewProps
}: {
    header: ReactNode
    article: BlockElement[]
    onTopPositionChange: OnTopPositionChangeFn
    wrapLayout: WrapLayout
}) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)

    return (
        <ScrollView {...wireScrollBarToDismiss(onTopPositionChange)}>
            {header}
            <View>
                <Wrap>
                    <View style={{ minHeight: height }}></View>
                </Wrap>

                <View style={[styles.webviewWrap]}>
                    <WebviewWithArticle
                        {...webviewProps}
                        scrollEnabled={false}
                        useWebKit={false}
                        onMessage={event => {
                            if (parseInt(event.nativeEvent.data) > height) {
                                setHeight(parseInt(event.nativeEvent.data))
                            }
                        }}
                        style={[styles.webview]}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const androidStyles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
    },
})
const ArticleWebViewAndroid = ({
    header,
    ...webviewProps
}: {
    header: ReactNode
    article: BlockElement[]
    wrapLayout: WrapLayout
}) => {
    const [height, setHeight] = useState<number | null>(null)
    const [scrollX] = useState(() => new Animated.Value(0))
    return (
        <View>
            {!!height && (
                <>
                    <UiBodyCopy>sdfdsfdsf</UiBodyCopy>
                    <WebviewWithArticle
                        {...webviewProps}
                        onScroll={Animated.event(
                            [
                                {
                                    nativeEvent: {
                                        contentOffset: {
                                            y: scrollX,
                                        },
                                    },
                                },
                            ],
                            /* webview doesnt support the native driver just yet :() */
                            { useNativeDriver: false },
                        )}
                        paddingTop={height}
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            height: 600,
                            backgroundColor: 'red',
                            width: 500,
                        }}
                    />
                </>
            )}

            <Animated.View
                onLayout={ev => {
                    console.log(ev)
                    setHeight(ev.nativeEvent.layout.height)
                }}
                renderToHardwareTextureAndroid
                needsOffscreenAlphaCompositing
                pointerEvents="none"
                style={[
                    androidStyles.header,
                    {
                        transform: [
                            {
                                translateY: scrollX.interpolate({
                                    inputRange: safeInterpolation([-1, 1]),
                                    outputRange: safeInterpolation([1, -1]),
                                }),
                            },
                        ],
                    },
                ]}
            >
                {header}
            </Animated.View>
        </View>
    )
}

const Article = ({
    article,
    onTopPositionChange,
    ...headerProps
}: {
    article: BlockElement[]
    onTopPositionChange: OnTopPositionChangeFn
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [wrapLayout, setWrapLayout] = useState<WrapLayout | null>(null)
    const [, { type }] = useArticle()

    const WebView =
        Platform.OS === 'android'
            ? ArticleWebViewAndroid
            : ArticleWebViewAndroid

    return (
        <>
            <Fader>
                {wrapLayout && (
                    <WebView
                        header={<ArticleHeader {...headerProps} type={type} />}
                        article={article}
                        onTopPositionChange={onTopPositionChange}
                        wrapLayout={wrapLayout}
                    />
                )}

                <Wrap onWrapLayout={setWrapLayout}></Wrap>
            </Fader>
        </>
    )
}

export { Article }
