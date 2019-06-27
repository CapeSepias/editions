import { useState, ReactElement, useEffect } from 'react'
import { REQUEST_INVALID_RESPONSE_STATE } from 'src/helpers/words'
import {
    ValueOrGettablePromise,
    isGettablePromise,
} from 'src/helpers/fetch/value-or-gettable-promise'

export interface Error {
    message: string
    name?: string
}
interface PendingResponse {
    state: 'pending'
}
interface ErroredResponse {
    state: 'error'
    error: Error
}
interface SuccesfulResponse<T> {
    state: 'success'
    response: T
}

export type PureResponse<T> =
    | PendingResponse
    | ErroredResponse
    | SuccesfulResponse<T>

export type Response<T> = PureResponse<T> & {
    retry: () => void
}

export interface ResponseHookCallbacks<T> {
    onSuccess: (res: T) => void
    onError: (error: Error) => void
}
export const useResponse = <T>(
    initial: T | null,
    { onRequestRetry }: { onRequestRetry: (response: PureResponse<T>) => void },
): [Response<T>, ResponseHookCallbacks<T>] => {
    const [responseValue, setResponseValue] = useState<
        SuccesfulResponse<T | null>['response']
    >(initial)
    const [error, setError] = useState<ErroredResponse['error']>({
        message: 'Mysterious error',
    })
    const [state, setState] = useState<Response<T>['state']>(
        initial ? 'success' : 'pending',
    )

    const onSuccess = (res: T) => {
        setResponseValue(res)
        setState('success')
    }
    const onError = (err: ErroredResponse['error']) => {
        setError(err)
        setState('error')
    }
    const getResponse = (): PureResponse<T> => {
        if (state === 'success' && responseValue) {
            return {
                state,
                response: responseValue,
            }
        }
        if (state === 'error') {
            return {
                state,
                error,
            }
        }
        return {
            state: 'pending',
        }
    }
    const response = getResponse()
    const retry = () => {
        setState('pending')
        onRequestRetry(response)
    }
    return [
        {
            ...response,
            retry,
        },
        {
            onSuccess,
            onError,
        },
    ]
}

interface WithResponseCallbacks {
    retry: () => void
}

export const withResponse = <T>(response: Response<T>) => ({
    success,
    pending,
    error,
}: {
    success: (resp: T, callbacks: WithResponseCallbacks) => ReactElement
    pending: (callbacks: WithResponseCallbacks) => ReactElement
    error: (error: Error, callbacks: WithResponseCallbacks) => ReactElement
}): ReactElement => {
    if (response.state === 'success')
        return success(response.response, { retry: response.retry })
    else if (response.state === 'pending')
        return pending({ retry: response.retry })
    else if (response.state === 'error')
        return error(response.error, { retry: response.retry })
    else
        return error(
            { message: REQUEST_INVALID_RESPONSE_STATE },
            { retry: () => {} },
        )
}

const promiseAsResponseEffect = <T>(
    promise: ValueOrGettablePromise<T>,
    { onSuccess, onError }: ResponseHookCallbacks<T>,
    state?: Response<T>['state'],
) => {
    /*
    if there's state lets request again
    bc it means it's a retry
    */
    if (state || isGettablePromise(promise)) {
        promise
            .getValue()
            .then(data => {
                onSuccess(data as T)
            })
            .catch((err: Error) => {
                /*
                TODO: response should handle the error + stale data
                case instead of eating it up here
                */
                if (state !== 'success') {
                    onError(err)
                }
            })
    }
}

export const usePromiseAsResponse = <T>(
    promise: ValueOrGettablePromise<T>,
): Response<T> => {
    const [response, callbacks] = useResponse<T>(
        isGettablePromise<T>(promise) ? null : promise.value,
        {
            onRequestRetry: oldResponse =>
                promiseAsResponseEffect(promise, callbacks, oldResponse.state),
        },
    )
    useEffect(() => {
        promiseAsResponseEffect(promise, callbacks)
    }, [])

    return response
}
