import React, { createContext, useState, useContext, useEffect } from 'react'
import { AccessController } from './lib/AccessController'
import {
    AnyAttempt,
    isValid,
    ResolvedAttempt,
    InvalidAttempt,
    NotRun,
} from './lib/Attempt'
import identity, {
    IdentityAuthData,
    AuthParams,
} from './authorizers/IdentityAuthorizer'
import cas from './authorizers/CASAuthorizer'
import iap from './authorizers/IAPAuthorizer'
import { CASExpiry } from './services/cas'
import { ReceiptIOS } from './services/iap'
import * as NetInfo from '@react-native-community/netinfo'

const AccessContext = createContext({
    attempt: NotRun as AnyAttempt<string>,
    canAccess: false,
    authIdentity: (
        params: AuthParams,
    ): Promise<ResolvedAttempt<IdentityAuthData>> =>
        Promise.resolve(InvalidAttempt('offline')),
    authCAS: (
        subscriberId: string,
        password: string,
    ): Promise<ResolvedAttempt<CASExpiry>> =>
        Promise.resolve(InvalidAttempt('offline')),
    authIAP: (): Promise<ResolvedAttempt<ReceiptIOS>> =>
        Promise.resolve(InvalidAttempt('offline')),
    idenityData: null as IdentityAuthData | null,
    casData: null as CASExpiry | null,
    signOutIdentity: () => {},
    signOutCAS: () => {},
})

const controller = new AccessController({
    identity,
    cas,
    iap,
})

const AccessProvider = ({
    children,
    onIdentityStatusChange = () => {},
}: {
    children: React.ReactNode
    onIdentityStatusChange?: (idAttempt: AnyAttempt<IdentityAuthData>) => void
}) => {
    const [attempt, setAttempt] = useState<AnyAttempt<string>>(NotRun)
    const [idAuth, setIdAuth] = useState<AnyAttempt<IdentityAuthData>>(NotRun)
    const [casAuth, setCASAuth] = useState<AnyAttempt<CASExpiry>>(NotRun)

    useEffect(() => {
        const unsubController = controller.subscribe(setAttempt)
        controller.subscribe(console.log)
        const unsubIdentity = controller.authorizerMap.identity.subscribe(
            attempt => {
                setIdAuth(attempt)
                onIdentityStatusChange(attempt)
            },
        )
        const unsubCAS = controller.authorizerMap.cas.subscribe(setCASAuth)
        NetInfo.addEventListener(info =>
            controller.handleConnectionStatusChanged(info.isConnected),
        )
        return () => {
            unsubController()
            unsubIdentity()
            unsubCAS()
        }
    }, [])

    const { cas, identity } = controller.authorizerMap

    return (
        <AccessContext.Provider
            value={{
                attempt,
                canAccess: !!attempt && isValid(attempt),
                idenityData: isValid(idAuth) ? idAuth.data : null,
                casData: isValid(casAuth) ? casAuth.data : null,
                authCAS: cas.runAuth.bind(cas),
                authIAP: iap.runAuth.bind(iap), // TODO: change this
                signOutCAS: cas.signOut.bind(cas),
                authIdentity: identity.runAuth.bind(identity),
                signOutIdentity: identity.signOut.bind(identity),
            }}
        >
            {children}
        </AccessContext.Provider>
    )
}

const useAccess = () => useContext(AccessContext).canAccess
const useIdentity = () => useContext(AccessContext).idenityData

export { AccessProvider, useAccess, useIdentity, AccessContext }
