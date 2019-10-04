import {
    withConnectivity,
    Connectivity,
    isValid,
    ValidAttempt,
    InvalidAttempt,
    AnyAttempt,
    ResolvedAttempt,
    NotRun,
    patchAttempt,
    isNotRun,
    hasRun,
} from './Attempt'
import { cataResult, AuthResult, ValidResult, InvalidResult } from './Result'

type UpdateHandler<T> = (data: AnyAttempt<T>) => void

export type AsyncCache<T> = {
    get: () => Promise<T | null>
    set: (data: T) => Promise<void>
    reset: () => Promise<void>
}

/**
 * This class is responsible for primarily piecing together a means of:
 *  - authorizing with user input credentials
 *  - authorizing with cached credentials that should have been cached
 *    while running aforementioned user input authorizer.
 *
 * It also takes the caches as its dependencies in order that it can clear them
 * when required.
 *
 * The `userDataCache` is used to cache the results of running either of the
 * authorizers in order to use this data when a user is offline. It shouldn't
 * be set manually and as such isn't passed to the auth functions.
 *
 * Finally, even if a user is authenticated against some service, they may
 * not have access to a resource (e.g. Editions) hence `checkUserHasAccess`, which
 * is used to generate an `accessAttempt` which is at least as restrictive as the
 * original `attempt` for the initial auth service.
 */
class Authorizer<T, A extends any[], C extends readonly AsyncCache<any>[]> {
    private subscribers: UpdateHandler<T>[] = []
    private attempt: AnyAttempt<T> = NotRun
    private accessAttempt: AnyAttempt<string> = NotRun

    constructor(
        readonly name: string,
        private userDataCache: AsyncCache<T>,
        private authCaches: C,
        /**
         * the main method for authing against a backend, takes the raw credentials
         * that would be input by the user and returns either an object representing
         * the valid data representing a known user, or null when they failed to
         * authenticate. All errors thrown will be caught and will set create an InvalidAttempt.
         */
        private auth: (args: A, caches: C) => Promise<AuthResult<T>>,
        /**
         * This should hit live endpoints with credentials stored on the
         * device (probably the keychain), in order to re-validate a user
         * e.g. at app open. This basically for silently logging in a user.
         */
        private authWithCachedCredentials: (
            authCaches: C,
        ) => Promise<AuthResult<T>>,
        private checkUserHasAccess: (data: T) => boolean,
    ) {}

    private async handleAuthPromise(
        promise: Promise<AuthResult<T>>,
        connectivity: Connectivity,
    ) {
        let attempt: ResolvedAttempt<T>
        try {
            const result = await promise

            attempt = cataResult<T, ResolvedAttempt<T>>(result, {
                valid: data => ValidAttempt(data, connectivity),
                invalid: reason => {
                    this.clearCaches()
                    return InvalidAttempt(connectivity, reason)
                },
                error: reason => InvalidAttempt(connectivity, reason),
            })
        } catch (e) {
            attempt = InvalidAttempt('online', 'Something went wrong')
        }
        this.upgradeAttempt(attempt)

        // return this to allow caller to check errors
        return attempt
    }

    public async runAuth(...args: A) {
        return this.handleAuthPromise(
            this.auth(args, this.authCaches),
            'online',
        )
    }

    private async getLastKnownAuthStatus(): Promise<AuthResult<T>> {
        try {
            const data = await this.userDataCache.get()
            return data ? ValidResult(data) : InvalidResult()
        } catch (e) {
            return InvalidResult()
        }
    }

    public async runAuthWithCachedCredentials(connectivity: Connectivity) {
        return withConnectivity(connectivity, {
            offline: () =>
                this.handleAuthPromise(
                    this.getLastKnownAuthStatus(),
                    'offline',
                ),
            online: () =>
                this.handleAuthPromise(
                    this.authWithCachedCredentials(this.authCaches),
                    'online',
                ),
        })
    }

    private clearCaches() {
        return Promise.all(
            this.authCaches
                .map(cache => cache.reset())
                .concat(this.userDataCache.reset()),
        ).then(() => {})
    }

    /**
     * This sets the attempt to Invalid
     */
    public signOut() {
        this.updateAttempt(InvalidAttempt('online'))
        return this.clearCaches()
    }

    /**
     * This returns an access attempt from  an auth attempt
     *
     * You may be able to authenticate with an authroizer but it
     * may be invalid
     *
     * This is probably a bit of a weird conecpt to go on this class
     * but still
     */
    public toAccessAttempt(attempt: AnyAttempt<T>): AnyAttempt<string> {
        if (isNotRun(attempt)) return attempt
        try {
            return isValid(attempt) && this.checkUserHasAccess(attempt.data)
                ? ValidAttempt(this.name, attempt.connectivity, attempt.time)
                : InvalidAttempt(
                      attempt.connectivity,
                      'Insufficient privileges',
                      attempt.time,
                  )
        } catch {
            return InvalidAttempt(
                attempt.connectivity,
                'Something went wrong',
                attempt.time,
            )
        }
    }

    public getAttempt() {
        return this.attempt
    }

    public getAccessAttempt() {
        return this.accessAttempt
    }

    public getUserData() {
        return isValid(this.attempt) ? this.attempt.data : null
    }

    public isAuth(connectivity: Connectivity) {
        return (
            hasRun(this.attempt) && this.attempt.connectivity === connectivity
        )
    }

    /**
     * This should subscribe a user to any updates to the
     * authentication status, it returns an unsubscribe function
     */
    public subscribe(fn: UpdateHandler<T>): () => void {
        this.subscribers.push(fn)
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== fn)
        }
    }

    /**
     * this will only overwrite the attempt if the attempt is more
     * prevalent than the last, if it's "more online" or "more valid"
     */
    private upgradeAttempt(attempt: ResolvedAttempt<T>) {
        const next = patchAttempt(this.attempt, attempt)
        if (!next) return
        return this.updateAttempt(next)
    }

    private updateAttempt(attempt: ResolvedAttempt<T>) {
        if (isValid(attempt)) {
            // this is async maybe we could await this?
            this.userDataCache.set(attempt.data)
        }
        this.attempt = attempt
        this.accessAttempt = this.toAccessAttempt(attempt)
        this.notifySubscribers()
    }

    private notifySubscribers() {
        this.subscribers.forEach(sub => sub(this.attempt))
    }
}

export { Authorizer }
