import React, { ReactNode, useState } from 'react'
import {
    ToastList,
    ToastProps,
    ToastRootHolder,
} from 'src/components/toast/toast'
import { createProviderFromHook, providerHook } from 'src/helpers/provider'

/*
  Exports
 */

const useToastInContext = () => {
    const [toast, setToast] = useState<ToastList>([])

    const removeLastToastWithTitle = (title: string) => {
        setToast(toasts => toasts.filter(toast => toast.title !== title))
    }

    const showToast = (
        title: ToastProps['title'],
        moreThings: Omit<ToastProps, 'title'> = {},
    ) => {
        setToast(toasts => [...toasts, { title, ...moreThings }])
        setTimeout(() => {
            removeLastToastWithTitle(title)
        }, 5000)
        removeLastToastWithTitle(title)
    }

    return providerHook({
        getter: toast,
        setter: { showToast },
    })
}

const {
    Provider: ToastProviderBase,
    useAsGetterHook: useToastList,
    useAsSetterHook: useToast,
} = createProviderFromHook(useToastInContext)

const ToastProvider = ({ children }: { children: ReactNode }) => (
    <ToastProviderBase>
        {children}
        <ToastRootHolder />
    </ToastProviderBase>
)

export { ToastProvider, useToast, useToastList }
