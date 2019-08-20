import React, { createContext, useContext, useMemo } from 'react'

export interface ProviderHook<G, S> {
    getter: G
    setter: S
}

export const providerHook = <G, S>({ getter, setter }: ProviderHook<G, S>) => ({
    getter,
    setter,
})

const useContextAsHook = <C extends unknown>(
    Context: React.Context<C | null>,
): C => {
    const ctx = useContext(Context)
    if (!ctx) {
        throw 'Missing context provider'
    }
    return ctx
}

/*
By splitting up getters and setters we avoid
components that only set values rerendering
when the values are changed

https://kentcdodds.com/blog/how-to-optimize-your-context-value/
*/

const createProviderFromHook = <G, S>(
    hook: () => ProviderHook<G, S> | null,
) => {
    const [GetterCtx, SetterCtx] = [
        createContext<G | null>(null),
        createContext<S | null>(null),
    ]

    const ProviderWithHook = ({
        getter,
        setter,
        children,
    }: ProviderHook<G, S> & {
        children: React.ReactNode
    }) => {
        const memoizedSetter = useMemo(() => setter, []) as S
        return (
            <SetterCtx.Provider value={memoizedSetter}>
                <GetterCtx.Provider value={getter}>
                    {children}
                </GetterCtx.Provider>
            </SetterCtx.Provider>
        )
    }

    const Provider = ({ children }: { children: React.ReactNode }) => {
        const hookVal = hook()
        if (hookVal) {
            return <ProviderWithHook {...hookVal}>{children}</ProviderWithHook>
        }
        return null
    }

    const useAsSetterHook = (): S => useContextAsHook(SetterCtx)
    const useAsGetterHook = (): G => useContextAsHook(GetterCtx)

    return { Provider, useAsGetterHook, useAsSetterHook }
}

const createMixedProviderHook__SLOW = <T extends {}>(hook: () => T | null) => {
    const Context = createContext<T | null>(null)
    const Provider = ({ children }: { children: React.ReactNode }) => {
        const value = hook()
        return (
            // @TODO: do we need to render a loading state here, it's so quick that we probably don't?
            value && (
                <Context.Provider value={value}>{children}</Context.Provider>
            )
        )
    }

    const useAsHook = (): T => useContextAsHook(Context)

    return { Provider, useAsHook }
}

export { createProviderFromHook, createMixedProviderHook__SLOW }
