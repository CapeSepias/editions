import { capitalizeFirstLetter, addCommas } from './format'
import { CrosswordArticle as CAPICrosswordArticle } from '../capi/articles'
import { CAPIArticle, Crossword, CrosswordArticle } from '../common'
import { getImageFromURL } from '../image'
import { ICrossword } from '@guardian/capi-ts'

const crosswordTypes = ['quick', 'cryptic', 'speedy', 'everyman'] as const

type CrosswordType = typeof crosswordTypes[number] | null

const getCrosswordType = (path: string): CrosswordType => {
    for (const key of crosswordTypes) {
        if (path.includes(key)) return key
    }
    return null
}

const getCrosswordName = (type: CrosswordType): string =>
    type ? capitalizeFirstLetter(type) + ' crossword' : 'Crossword'

const getCrosswordKicker = (crossword: ICrossword) =>
    addCommas(crossword.number)

//TODO: get images according to type
const getCrosswordImage = (type: CrosswordType) => {
    if (type === 'cryptic') {
    }
    return getImageFromURL(
        'https://media.guim.co.uk/0789ff75f7095cd56f5d74a098289baed429772a/0_0_2048_2048/1000.jpg',
    )
}

type CrosswordArticleOverrides = Pick<
    CAPIArticle,
    'headline' | 'kicker' | 'image'
> &
    Pick<CrosswordArticle, 'crossword'>

const getCrosswordArticleOverrides = (
    article: CAPICrosswordArticle,
): CrosswordArticleOverrides => {
    const type = getCrosswordType(article.path)
    return {
        headline: getCrosswordName(type),
        kicker: getCrosswordKicker(article.crossword),
        image: getCrosswordImage(),
        crossword: (article.crossword as unknown) as Crossword,
    }
}

export { CrosswordType, getCrosswordArticleOverrides }
