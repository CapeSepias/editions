import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List } from '../components/lists/list'
import { MonoTextBlock } from '../components/styled-text'
import { NavigationScreenProp } from 'react-navigation'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})

export class IssueScreen extends React.Component<{
    navigation: NavigationScreenProp<{}>
}> {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.getParam('issue', 'NO-ID'),
    })

    render() {
        const { navigation } = this.props
        const issue = navigation.getParam('issue', 'NO-ID')
        return (
            <ScrollView style={styles.container}>
                <List
                    onPress={item => navigation.navigate('Front', item)}
                    data={[
                        {
                            key: 'news',
                            title: 'News front',
                            data: {
                                issue,
                                front: 'news',
                            },
                        },
                        {
                            key: 'sport',
                            title: 'Sport front',
                            data: {
                                issue,
                                front: 'sport',
                            },
                        },
                    ]}
                    {...{ navigation }}
                />
                <MonoTextBlock>
                    This is an IssueScreen for issue {issue}
                </MonoTextBlock>
            </ScrollView>
        )
    }
}
