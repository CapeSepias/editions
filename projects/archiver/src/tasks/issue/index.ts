import { Handler } from 'aws-lambda'
import { attempt, hasFailed } from '../../../../backend/utils/try'
import { Issue, IssuePublicationIdentifier } from '../../../common'
import { getIssue } from '../../utils/backend-client'
import { Bucket } from '../../utils/s3'
import { getPublishedId } from '../../utils/path-builder'
import { handleAndNotify } from '../../services/task-handler'

export interface IssueParams {
    issuePublication: IssuePublicationIdentifier
}
export interface IssueTaskOutput extends IssueParams {
    issue: Issue
    message?: string
    fronts: string[]
    remainingFronts: number
}
export const handler: Handler<IssueParams, IssueTaskOutput> = handleAndNotify(
    'started',
    async ({ issuePublication }) => {
        console.log(
            `Attempting to upload ${JSON.stringify(
                issuePublication,
            )} to ${Bucket}`,
        )
        const publishedId = getPublishedId(issuePublication)
        const issue = await attempt(getIssue(publishedId))
        if (hasFailed(issue)) {
            console.log(JSON.stringify(issue))
            throw new Error('Failed to download issue.')
        }
        console.log(`Downloaded issue ${JSON.stringify(issuePublication)}`)
        return {
            issuePublication,
            issue: { ...issue, fronts: [] },
            fronts: issue.fronts,
            remainingFronts: issue.fronts.length,
            message: 'Fetched issue succesfully.',
        }
    },
)
