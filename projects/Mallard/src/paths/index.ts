import {
    issuePath,
    mediaPath,
    frontPath,
    Image,
    IssueCompositeKey,
} from 'src/common'
import RNFetchBlob from 'rn-fetch-blob'

interface API {
    issue: (issueId: IssueCompositeKey) => string
    front: (issueId: IssueCompositeKey, frontId: string) => string
    // media:
}

const APIPaths = {
    issue: issuePath,
    front: frontPath,
    media: mediaPath,
    mediaBackend: 'https://d2cf1ljtg904cv.cloudfront.net/', // TODO: Use s3 issue paths.
}

const issuesDir = `${RNFetchBlob.fs.dirs.DocumentDir}/issues`

const imagePath = (image: Image) =>
    `${APIPaths.mediaBackend}${APIPaths.media(
        'issue',
        'phone',
        image.source,
        image.path,
    )}`

const issueRoot = (issueId: string) => `${issuesDir}/${issueId}`
const mediaRoot = (issueId: string) => `${issueRoot(issueId)}/media`

const FSPaths = {
    issuesDir,
    issueRoot,
    mediaRoot,
    media: (issueId: string, source: string, path: string) =>
        `${mediaRoot(issueId)}/cached/${source}/${path}`,
    issueZip: (issueId: string) => `${issueRoot(issueId)}.zip`,
    issue: (issueId: string) => `${issueRoot(issueId)}/issue`,
    collection: (issueId: string, collectionId: string) =>
        `${issueRoot(issueId)}/collection/${collectionId}`,
    front: (issueId: string, frontId: string) =>
        `${issueRoot(issueId)}/front/${frontId}`,
}

export { FSPaths, APIPaths, imagePath }
