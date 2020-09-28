import { EditionId, EditionsList, IssueSummary } from '.'

export const issueSummaryComparator = (a: IssueSummary, b: IssueSummary) => {
    return a.date.localeCompare(b.date)
}

export const issueSummarySort = (issues: IssueSummary[]): IssueSummary[] => {
    return issues.sort(issueSummaryComparator).reverse()
}

export const getEditionIds = (editionList: EditionsList): EditionId[] =>
    editionList.regionalEditions
        .map(e => e.edition)
        .concat(editionList.specialEditions.map(e => e.edition))
