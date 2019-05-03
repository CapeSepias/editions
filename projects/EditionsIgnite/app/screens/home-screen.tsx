import React, { useState } from "react"
import { Image, Platform, ScrollView, Button, StyleSheet, Text, View } from "react-native"
import { MonoText } from "../components/styled-text"
import { List } from "../components/list"
import { NavigationScreenProp } from "react-navigation"
import RNFetchBlob from "rn-fetch-blob"

export const HomeScreen = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.getStartedContainer}>
          <Image
            source={require("../assets/images/roundel-192x192.png")}
            style={styles.welcomeImage}
          />
        </View>
        <List
          data={[
            { key: "sunday-30", issue: "sunday-30", title: "Sunday 30" },
            { key: "monday-1", issue: "monday-1", title: "Monday 1" },
          ]}
          to="Issue"
          {...{ navigation }}
        />
        <View style={styles.getStartedContainer}>
          <Text style={styles.getStartedText}>Get started by opening</Text>

          <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
            <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
          </View>
          <Button
            title={`Download Nvidia drivers (${Math.ceil(progress * 100)}%)`}
            onPress={() => {
              RNFetchBlob.config({ fileCache: true })
                .fetch(
                  "GET",
                  `https://ftp.mozilla.org/pub/firefox/releases/45.0.2/linux-x86_64/as/firefox-45.0.2.tar.bz2?date=${Date.now()}`,
                )
                .progress((received, total) => {
                  setProgress(received / total)
                })
                .then(async res => {
                  const path = `${RNFetchBlob.fs.dirs.DocumentDir}/issues/test-${Date.now()}.zip`
                  return RNFetchBlob.fs.mv(res.path(), path)
                })
                .catch((errorMessage, statusCode) => {
                  alert(errorMessage)
                })
            }}
          />
          <Button
            title="List stuff in issues"
            onPress={() => {
              RNFetchBlob.fs
                .ls(RNFetchBlob.fs.dirs.DocumentDir + "/issues")
                // files will an array contains filenames
                .then(files => {
                  alert(RNFetchBlob.fs.dirs.DocumentDir)
                  setFiles(files)
                })
            }}
          />
          <List
            data={files.map(file => ({ key: file, title: file }))}
            to="Issue"
            {...{ navigation }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

HomeScreen.navigationOptions = ({ navigation }) => ({
  title: "Home",
  headerRight: <Button onPress={() => navigation.navigate("Settings")} title="Settings" />,
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  developmentModeText: {
    marginBottom: 20,
    marginTop: 20,
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    lineHeight: 19,
    textAlign: "center",
  },

  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: "contain",
  },
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
    marginVertical: 7,
    padding: 16,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: "rgba(96,100,109, 0.8)",
  },
  codeHighlightContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center",
  },
  tabBarInfoText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    textAlign: "center",
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
})
