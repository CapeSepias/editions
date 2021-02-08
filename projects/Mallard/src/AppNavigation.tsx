import React from 'react'
import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack'

import { routeNames } from './navigation/routes'
import { HomeScreen } from './screens/home-screen'
import { IssueScreen } from './screens/issue-screen'
import { EditionsMenuScreen } from './screens/editions-menu-screen'
import { Animated } from 'react-native'
import {
    ArticleWrapper,
    SlideCardJames,
    wrapInSlideCard,
} from './navigation/navigators/article'
import { ArticleScreen } from './screens/article-screen'
import {
    SettingsScreen,
    SettingsScreenWithHeader,
} from './screens/settings-screen'
import { AuthSwitcherScreen } from './screens/identity-login-screen'
import { OnboardingConsentScreen } from './screens/onboarding-screen'
import {
    GdprConsentScreen,
    GdprConsentScreenForOnboarding,
    GdprConsentScreenWithHeader,
} from './screens/settings/gdpr-consent-screen'
import {
    PrivacyPolicyScreen,
    PrivacyPolicyScreenForOnboarding,
    PrivacyPolicyScreenWithHeader,
} from './screens/settings/privacy-policy-screen'
import {
    AlreadySubscribedScreen,
    AlreadySubscribedScreenWithHeader,
} from './screens/settings/already-subscribed-screen'
import { CasSignInScreen } from './screens/settings/cas-sign-in-screen'
import { ManageEditionsScreenWithHeader } from './screens/settings/manage-editions-screen'
import {
    BetaProgrammeFAQsScreen,
    BetaProgrammeFAQsScreenWithHeader,
} from './screens/settings/beta-programme-faqs'
import {
    CreditsScreen,
    CreditsScreenWithHeader,
} from './screens/settings/credits-screen'
import { EditionsScreen } from './screens/settings/editions-screen'
import { FAQScreen, FAQScreenWithHeader } from './screens/settings/faq-screen'
import {
    HelpScreen,
    HelpScreenWithHeader,
} from './screens/settings/help-screen'
import { SubscriptionDetailsScreen } from './screens/settings/subscription-details-screen'
import {
    TermsAndConditionsScreen,
    TermsAndConditionsScreenWithHeader,
} from './screens/settings/terms-and-conditions-screen'

const Stack = createStackNavigator()

const { multiply } = Animated

const cardStyleInterpolator = props => {
    const translateX = multiply(
        props.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [props.layouts.screen.width, 0],
            extrapolate: 'clamp',
        }),
        props.inverted,
    )
    console.log(props.inverted)

    return {
        // ...CardStyleInterpolators.forHorizontalIOS(props),
        cardStyle: {
            overflow: 'hidden',
            transform: [
                // Translation for the animation of the current card
                {
                    translateX,
                },
            ],
        },
        overlayStyle: {
            opacity: props.current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
            }),
        },
    }
}

let animatedValue = new Animated.Value(0)

const RootStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ gestureEnabled: false, headerShown: false }}
        >
            <Stack.Screen
                name={routeNames.Issue}
                component={IssueScreen}
                options={{}}
            />
            <Stack.Screen
                name={routeNames.IssueList}
                component={HomeScreen}
                options={{
                    gestureDirection: 'horizontal',
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: true,
                    cardStyleInterpolator,
                }}
            />
            <Stack.Screen
                name={routeNames.EditionsMenu}
                component={EditionsMenuScreen}
                options={{
                    gestureDirection: 'horizontal-inverted',
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: true,
                    cardStyleInterpolator,
                }}
            />
            <Stack.Screen
                name={routeNames.Article}
                component={ArticleWrapper}
                options={{
                    cardStyleInterpolator:
                        CardStyleInterpolators.forModalPresentationIOS,
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                }}
            />
            {/* <Stack.Screen
                name={routeNames.Article}
                component={SlideCardJames}
                options={{
                    cardStyleInterpolator: props => {
                        return {
                            ...CardStyleInterpolators.forModalPresentationIOS(
                                props,
                            ),
                        }
                    },
                }}
            /> */}
            <Stack.Screen
                name={routeNames.Settings}
                component={SettingsScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.SignIn}
                component={AuthSwitcherScreen}
            />
            {/* <Stack.Screen
                name={routeNames.OnboardingStart}
            /> */}
            <Stack.Screen
                name={routeNames.onboarding.OnboardingConsent}
                component={OnboardingConsentScreen}
            />
            <Stack.Screen
                name={routeNames.onboarding.OnboardingConsentInline}
                component={GdprConsentScreenForOnboarding}
            />
            <Stack.Screen
                name={routeNames.onboarding.PrivacyPolicyInline}
                component={PrivacyPolicyScreenForOnboarding}
            />
            <Stack.Screen
                name={routeNames.AlreadySubscribed}
                component={AlreadySubscribedScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.CasSignIn}
                component={CasSignInScreen}
            />
            <Stack.Screen
                name={routeNames.ManageEditionsSettings}
                component={ManageEditionsScreenWithHeader}
            />
            {/** @TODO Fix the enable all button */}
            <Stack.Screen
                name={routeNames.GdprConsent}
                component={GdprConsentScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.PrivacyPolicy}
                component={PrivacyPolicyScreenWithHeader}
            />

            {/* ==== Inspect from here === */}
            <Stack.Screen
                name={routeNames.Edition}
                component={EditionsScreen}
            />
            <Stack.Screen
                name={routeNames.TermsAndConditions}
                component={TermsAndConditionsScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.BetaProgrammeFAQs}
                component={BetaProgrammeFAQsScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.Help}
                component={HelpScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.Credits}
                component={CreditsScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.FAQ}
                component={FAQScreenWithHeader}
            />
            <Stack.Screen
                name={routeNames.SubscriptionDetails}
                component={SubscriptionDetailsScreen}
            />
            {/* Turned off to remove Promise rejection error on Android */}
            {/* <Stack.Screen
                name={routeNames.Storybook}
                component={StorybookScreen}
            /> */}
        </Stack.Navigator>
    )
}

export { RootStack }
