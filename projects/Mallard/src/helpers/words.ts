import { isInBeta } from './release-stream'
import { Platform } from 'react-native'

export const REQUEST_INVALID_RESPONSE_STATE = 'Request failed'
export const REQUEST_INVALID_RESPONSE_VALIDATION = 'Failed to parse data'
export const LOCAL_JSON_INVALID_RESPONSE_VALIDATION =
    'Failed to parse local data'

export const APP_DISPLAY_NAME = 'Daily Edition'
export const FEEDBACK_EMAIL = 'daily.feedback@theguardian.com'
export const COOKIE_LINK = 'https://www.theguardian.com/info/cookies'
export const PRIVACY_LINK = 'https://www.theguardian.com/info/privacy'
export const IOS_BETA_EMAIL = 'daily.ios.beta@theguardian.com'
export const ANDROID_BETA_EMAIL = 'daily.android.beta@theguardian.com'
export const ISSUE_EMAIL = 'daily.feedback@theguardian.com'
export const SUBSCRIPTION_EMAIL = 'subscriptions@theguardian.com'
export const READERS_EMAIL = 'guardian.readers@theguardian.com'
export const APPS_FEEDBACK_EMAIL = 'daily.feedback@theguardian.com'

export const CONNECTION_FAILED_ERROR = `Connection failed`
export const CONNECTION_FAILED_SUB_ERROR = `Let's try and get your issue`
export const CONNECTION_FAILED_AUTO_RETRY =
    'Next time you go online, we will download your issue'
export const GENERIC_ERROR = `Sorry! This didn't work`
export const GENERIC_AUTH_ERROR = `Something went wrong`
export const GENERIC_FATAL_ERROR = `Sorry! We broke the app. Can you email us at ${FEEDBACK_EMAIL} and tell us what happened?`
export const NOT_CONNECTED = 'You are not connected to the internet'
export const MANAGE_EDITIONS_TITLE = 'Manage Downloads'
export const WIFI_ONLY_DOWNLOAD = `You must be connected to wifi to download, you can change this under '${MANAGE_EDITIONS_TITLE}'`

export const DIAGNOSTICS_TITLE = 'Found a bug?'
export const DIAGNOSTICS_REQUEST = `Would you like us to include diagnostic information to help answer your query?${
    isInBeta()
        ? `

${Platform.select({
    ios:
        'If you would like to switch back from this beta back to the general app you can delete this app and reinstall it from the app store.',
    android:
        'If you would like to switch back from this beta back to the general app you can find this app on the Play Store, leave the beta from the Play Store page, uninstall the app and then reinstall the app.',
})}`
        : ``
}`

export const ERR_404_MISSING_PROPS = `Couldn't find a path to this item`
export const ERR_404_REMOTE = `Couldn't find item`

export const PREFS_SAVED_MSG = 'Your preferences are saved.'

export const PRIVACY_SETTINGS_HEADER_TITLE = 'Privacy Settings'
export const PRIVACY_POLICY_HEADER_TITLE = 'Privacy Policy'
export const REFRESH_BUTTON_TEXT = 'Refresh'
export const DOWNLOAD_ISSUE_MESSAGE_OFFLINE = `You're currently offline. You can download it when you go online`

// Sign in modal
export const ONBOARDING_TITLE = 'Already a subscriber?'
export const ONBOARDING_SUBTITLE =
    'Sign in with your subscriber details to continue'
export const EXPLAINER_TITLE = 'Not subscribed yet?'
export const EXPLAINER_SUBTITLE = `${Platform.select({
    ios: 'Get the Daily with a digital subscription from The Guardian website.',

    android: 'Read the Daily with a digital subscription from The Guardian.',
})}`
export const FREE_TRIAL = 'Start your free 14 day trial'

// Failed sign in modal
export const APPLE_RELAY_TITLE = 'We are unable to verify your subscription'
export const APPLE_RELAY_BODY = `We are unable to detect your subscription as it seems you chose not to share your email address with us. \n \nPlease try a different sign in method. You will need to use the same email address as your Digital subscription. Alternatively, use your subscriber ID.`
export const APPLE_RELAY_RETRY = 'Try alternative sign in method'

export const SIGN_IN_FAILED_TITLE = 'Subscription not found'
export const CUSTOMER_HELP_EMAIL = 'customer.help@theguardian.com'
export const SIGN_IN_FAILED_BODY = `We were unable to find a subscription associated with %email%. Try signing in with a different email or contact us at ${CUSTOMER_HELP_EMAIL}`
export const SIGN_IN_FAILED_RETRY = 'Try a different email'

// Sub found modal
export const SUB_FOUND_TITLE = 'Subscription found'
export const SUB_FOUND_SUBTITLE =
    'Enjoy the Guardian and thank you for your support'

// Sub not found modal
export const SUB_NOT_FOUND_TITLE = 'Already a subscriber?'
export const SUB_NOT_FOUND_EXPLAINER = 'Not subscribed yet?'
export const SUB_NOT_FOUND_EXPLAINER_SUBTITLE = `${Platform.select({
    ios: 'To get a free trial with our digital subscription, visit our website',

    android: 'Get a free trial with our digital subscription',
})}`
export const SUB_NOT_FOUND_SIGN_IN = 'Sign in to activate'
export const SUB_NOT_FOUND_SUBSCRIBER_ID_BUTTON = 'Activate with subscriber ID'

// Already Subscribed
export const ALREADY_SUBSCRIBED_SIGN_IN_TITLE = 'Sign in to activate'
export const ALREADY_SUBSCRIBED_SUBSCRIBER_ID_TITLE =
    'Activate with subscriber ID'
export const ALREADY_SUBSCRIBED_RESTORE_IAP_TITLE =
    'Restore App Store subscription'
export const ALREADY_SUBSCRIBED_RESTORE_ERROR_TITLE = 'Verification error'
export const ALREADY_SUBSCRIBED_RESTORE_ERROR_SUBTITLE =
    'There was a problem whilst verifying your subscription'
export const ALREADY_SUBSCRIBED_RESTORE_MISSING_TITLE = 'Subscription not found'
export const ALREADY_SUBSCRIBED_RESTORE_MISSING_SUBTITLE =
    'We were unable to find a subscription associated with your Apple ID'
