import { AppRegistry, YellowBox, Text } from 'react-native'
import { name as appName } from './app.json'
import App from 'application-code/src/App'
import { errorService } from 'application-code/src/services/errors'

// In lieu of a wrapper component (i.e. <UnscaledText />), this quickly opts us out of scaled text globally.
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

// Supress Could Not Find Image warnings as a result of our approach to find the image locally
YellowBox.ignoreWarnings(['Could not find image'])

if (!__DEV__) {
    errorService.init()
}

AppRegistry.registerComponent(appName, () => App)