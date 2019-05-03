import React from "react"
import { View, StyleSheet } from "react-native"
import { MonoTextBlock } from "../components/styled-text"
import { Transition } from "react-navigation-fluid-transitions"
import { NavigationScreenProp } from "react-navigation"
import { color } from "../theme/color"

export class ArticleScreen extends React.Component<{ navigation: NavigationScreenProp<{}> }> {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("article", "NO-ID"),
  })

  render() {
    const { navigation } = this.props
    const issue = navigation.getParam("issue", "NO-ID")
    const front = navigation.getParam("front", "NO-ID")
    const article = navigation.getParam("article", "NO-ID")
    return (
      <Transition shared={`item-${article}`}>
        <View style={styles.container}>
          <MonoTextBlock>
            This is an ArticleScreen for article {article}. from front {front}, issue {issue}
          </MonoTextBlock>
        </View>
      </Transition>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    color: "#fff",
    flex: 1,
    alignItems: "center",
    backgroundColor: color.palette.highlight.main,
  },
})
