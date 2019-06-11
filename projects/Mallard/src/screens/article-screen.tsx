import React, { useState } from 'react'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { Article } from '../components/article'
import { Article as ArticleType } from '../common'
import { View, TouchableOpacity, Text } from 'react-native'
import { metrics } from '../theme/spacing'
import { UiBodyCopy } from '../components/styled-text'

type MaybeArticle = ArticleType | null

const useArticleData = (path: string, { headline }: { headline: string }) => {
    return useEndpoint<MaybeArticle>(`content/${path}`, null, res => res)
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const articleFromUrl = navigation.getParam('path', '')
    const headlineFromUrl = navigation.getParam(
        'headline',
        'HEADLINE NOT FOUND',
    )
    const [appearance, setAppearance] = useState(0)
    const article = useArticleData(articleFromUrl, {
        headline: headlineFromUrl,
    })
    console.log(article)
    if (!article) {
        return (
            <View style={{ backgroundColor: 'pink', fontSize: 9999 }}>
                <Text style={{ color: 'blue', fontSize: 9999 }}>Loading</Text>
            </View>
        )
    }
    const { title, elements, imageURL } = article

    const appearances = Object.keys(articleAppearances)
    return (
        <>
            <View
                style={{
                    backgroundColor: 'tomato',
                    position: 'absolute',
                    zIndex: 9999,
                    elevation: 999,
                    bottom: 100,
                    right: metrics.horizontal,
                    alignSelf: 'flex-end',
                    borderRadius: 999,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setAppearance(app => {
                            if (app + 1 >= appearances.length) {
                                return 0
                            }
                            return app + 1
                        })
                    }}
                >
                    <UiBodyCopy
                        style={{
                            padding: metrics.horizontal * 2,
                            paddingVertical: metrics.vertical / 1.5,
                            color: '#fff',
                        }}
                    >
                        {`${appearances[appearance]} 🌈`}
                    </UiBodyCopy>
                </TouchableOpacity>
            </View>
            <WithArticleAppearance
                value={appearances[appearance] as ArticleAppearance}
            >
                <Article
                    article={elements}
                    kicker={'Kicker 🥾'}
                    headline={title}
                    byline={'Byliney McPerson'}
                    standfirst={`Is this delicious smoky dip the ultimate aubergine recipe – and which side of the great tahini divide are you on?`}
                    image={imageURL}
                    navigation={navigation}
                />
            </WithArticleAppearance>
        </>
    )
}

ArticleScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: navigation.getParam('article', 'NO-ID'),
    gesturesEnabled: true,
    gestureResponseDistance: {
        vertical: metrics.headerHeight + metrics.slideCardSpacing,
    },
})
