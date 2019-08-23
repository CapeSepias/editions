import { Handler } from 'aws-lambda'
import { StepFunctions } from 'aws-sdk'
import {
    Attempt,
    attempt,
    failure,
    Failure,
    hasFailed,
    hasSucceeded,
    withFailureMessage,
} from '../../backend/utils/try'
import { IssueParams } from './issueTask'
import { randomBytes } from 'crypto'
const stateMachineArnEnv = 'stateMachineARN'
const stateMachineArn = process.env[stateMachineArnEnv]
interface Record {
    s3: { bucket: { name: string }; object: { key: string } }
    eventTime: string
} //partial of https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
interface Issue {
    source: string
    id: string
}

const parseRecord = (record: Record): Attempt<Issue> => {
    const key = decodeURIComponent(record.s3.object.key)
    const [, id, filename] = key.split('/')
    if (filename === undefined || id === undefined) {
        return failure({
            error: new Error(),
            messages: [`⚠️ ${key} does not correspond to an issue`],
        })
    }
    const source = filename.replace('.json', '')
    return { source, id }
}

export const handler: Handler<
    {
        Records: Record[]
    },
    (string | Failure)[]
> = async ({ Records }) => {
    console.log('Attempting to invoke.')
    console.log(JSON.stringify(Records))
    if (stateMachineArn == null) {
        throw new Error('No State Machine ARN configured')
    }

    const sf = new StepFunctions({
        region: 'eu-west-1',
    })

    const maybeIssues = Records.map(parseRecord)
    console.log(`Found following: ${JSON.stringify(maybeIssues)}`)

    const issues = maybeIssues.filter(hasSucceeded)
    const runs = await Promise.all(
        issues.map(async issueId => {
            const invoke: IssueParams = {
                issueId,
            }
            const run = await attempt(
                sf
                    .startExecution({
                        stateMachineArn,
                        input: JSON.stringify(invoke),
                        name: `issue-${invoke.issueId.id}-${
                            invoke.issueId.source
                        }-${randomBytes(2).toString('hex')}`,
                    })
                    .promise(),
            )
            if (hasFailed(run)) {
                console.error(
                    `⚠️ Invocation of ${JSON.stringify(issueId)} failed.`,
                )
                return withFailureMessage(
                    run,
                    `⚠️ Invocation of ${JSON.stringify(issueId)} failed.`,
                )
            }
            console.log(
                `Invoation of step function for ${JSON.stringify(
                    issueId,
                )} succesful`,
            )
            return issueId
        }),
    )

    const invalidKeys = runs.filter(hasFailed)

    const succesfulInvocations = runs
        .filter(hasSucceeded)
        .map(issue => `✅ Invocation of ${JSON.stringify(issue)} succeeded.`)
    const failedInvocations = runs.filter(hasFailed)
    console.error(JSON.stringify([...failedInvocations, ...invalidKeys]))
    if (succesfulInvocations.length < 1)
        throw new Error('No invocations were made.')
    return [...succesfulInvocations, ...failedInvocations, ...invalidKeys]
}
