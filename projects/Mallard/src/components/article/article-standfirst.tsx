import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { StandfirstText, BodyCopy } from '../styled-text'
import { metrics } from '../../theme/spacing'
import {
    useArticleAppearance,
    articleAppearances,
} from '../../theme/appearance'

export type PropTypes = {
    standfirst: string
    byline: string
}

const styles = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingTop: metrics.vertical / 2,
        ...articleAppearances.default.backgrounds,
    },
    bylineBackground: {
        ...articleAppearances.default.backgrounds,
        borderTopWidth: StyleSheet.hairlineWidth,
        marginTop: metrics.vertical,
        marginBottom: metrics.vertical,
        paddingTop: metrics.vertical / 4,
        width: '100%',
    },
})

const Standfirst = ({ standfirst, byline }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <View style={[styles.background, appearance.backgrounds]}>
            <StandfirstText style={[appearance.text, appearance.standfirst]}>
                {standfirst}
            </StandfirstText>
            <View style={[styles.bylineBackground, appearance.backgrounds]}>
                <BodyCopy
                    weight={'bold'}
                    style={[appearance.text, appearance.byline]}
                >
                    {byline}
                </BodyCopy>
            </View>
        </View>
    )
}

export { Standfirst }
