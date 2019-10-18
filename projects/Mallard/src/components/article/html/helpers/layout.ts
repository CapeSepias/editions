import { css, px } from 'src/helpers/webview'
import { metrics } from 'src/theme/spacing'

export const breakSides = css`
    margin-left: ${px(metrics.article.sidesTablet * -1)};
    padding-left: ${px(metrics.article.sidesTablet)};
    margin-right: ${px(metrics.article.sidesTablet * -1)};
    padding-right: ${px(metrics.article.sidesTablet)};
`
