import {
    gdprSwitchSettings,
    Settings,
    gdprConsentVersionKey,
    GdprBuckets,
    GdprSwitchSettings,
    CURRENT_CONSENT_VERSION,
} from 'src/helpers/settings'
import { isPreview } from 'src/helpers/settings/defaults'
import { useSettingsFromStore, applyExtractSettings } from './settings/helpers'
import {
    createProviderFromHook,
    providerHook,
    nestProviders,
} from 'src/helpers/provider'
import { ThreeWaySwitchValue } from 'src/components/layout/ui/switch'

/*
build out all the hooks needed for settings

extracting settings is a performance
optimisation.
Often read settings should be extracted
so their consumers don't rerender when any other
setting changes and only rerender when they
themselves change
*/
const makeSettingsHooks = <E extends keyof Settings>({
    extractSettings,
}: {
    extractSettings: (E)[]
}) => {
    const {
        Provider: BaseProvider,
        useAsSetterHook,
        useAsGetterHook,
    } = createProviderFromHook(() => {
        const [settings, { storeSetting }] = useSettingsFromStore()
        return (
            settings &&
            providerHook({
                getter: settings as Omit<Settings, E>,
                setter: storeSetting,
            })
        )
    })

    const { providers, extractedGetterHooks } = applyExtractSettings(
        extractSettings,
    )

    const Provider = nestProviders(BaseProvider, ...providers)

    return { Provider, extractedGetterHooks, useAsSetterHook, useAsGetterHook }
}

const {
    Provider: SettingsProvider,
    extractedGetterHooks: useSettingsValue,
    useAsSetterHook: useSettings,
    useAsGetterHook: useOtherSettingsValues,
} = makeSettingsHooks({
    extractSettings: ['isUsingProdDevtools', 'apiUrl'],
})

/* extra bespoke getters */
const useIsPreview = () => {
    const apiUrl = useSettingsValue.apiUrl()
    return isPreview(apiUrl)
}

const useGdprSwitches = () => {
    const setSetting = useSettings()
    const settings = useOtherSettingsValues()

    /*
    if a user consents to all via any UI
    means we wanna flip their null switches
    but respect the explicit no's
    */
    const enableNulls = () => {
        gdprSwitchSettings.map(sw => {
            if (settings[sw] === null) {
                setSetting(sw, true)
            }
        })
    }

    const setConsentVersion = (version: number | null) => {
        setSetting(gdprConsentVersionKey, version)
    }

    const setConsent = (
        consentBucketKey: keyof GdprSwitchSettings,
        value: ThreeWaySwitchValue,
    ) => {
        setSetting(consentBucketKey, value)
        GdprBuckets[consentBucketKey].forEach(key => {
            setSetting(key, value)
        })
        setConsentVersion(CURRENT_CONSENT_VERSION)
    }

    const consentToAll = () => {
        gdprSwitchSettings.forEach(sw => {
            setConsent(sw, true)
        })
        setConsentVersion(CURRENT_CONSENT_VERSION)
    }

    /*
    for our own convenience let's add
    a quick toggle to set switches back to
    null (which is made impossible from
    the userland UI by design)
    */
    const DEVMODE_resetAll = () => {
        gdprSwitchSettings.forEach(sw => {
            setConsent(sw, null)
        })
        setConsentVersion(null)
    }

    return { enableNulls, DEVMODE_resetAll, setConsent, consentToAll }
}

export {
    SettingsProvider,
    useSettingsValue,
    useSettings,
    useOtherSettingsValues,
}
export { useGdprSwitches, useIsPreview }
