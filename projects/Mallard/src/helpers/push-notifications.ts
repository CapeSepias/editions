import PushNotification from 'react-native-push-notification'
import { PushNotificationIOS, Platform } from 'react-native'
import { fetchFromNotificationService } from 'src/helpers/fetch'
import { downloadAndUnzipIssue, clearOldIssues } from 'src/helpers/files'
import { imageForScreenSize } from 'src/helpers/screen'

const pushNotifcationRegistration = () =>
    PushNotification.configure({
        onRegister: (token: { token: string } | undefined) => {
            if (token) {
                fetchFromNotificationService(token)
            }
        },
        onNotification: (notification: any) => {
            const key =
                Platform.OS === 'ios' ? notification.data.key : notification.key
            if (key) {
                const screenSize = imageForScreenSize()
                downloadAndUnzipIssue(key, screenSize)
                clearOldIssues()
            }

            // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
            notification.finish(PushNotificationIOS.FetchResult.NoData)
        },
        senderID: '43377569438',
        permissions: {
            alert: false,
            badge: false,
            sound: false,
        },
    })

export { pushNotifcationRegistration }
