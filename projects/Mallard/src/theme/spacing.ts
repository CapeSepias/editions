import { Platform, StatusBar, PixelRatio } from 'react-native'
import { Size, toSize } from 'src/helpers/sizes'
import { getFont } from './typography'

const spacing = [0, 3, 6, 12, 18, 30]

const headerHeight = spacing[5]
const basicMetrics = {
    horizontal: 14,
    vertical: 10,
}

const buttonHeight = getFont('sans', 1).fontSize + basicMetrics.vertical * 2.5

const sides = {
    sides: basicMetrics.horizontal / 1,
    sidesTablet: basicMetrics.horizontal * 1,
}
const sliderRadius = 18

export const metrics = {
    ...basicMetrics,
    headerHeight,
    buttonHeight,
    radius: 10,
    sides,
    article: {
        ...sides,
        maxWidth: 800,
        rightRail: 170 + sides.sidesTablet,
        railPaddingLeft: sides.sidesTablet * 1.5,
        standfirstBottom: basicMetrics.vertical * 1.5,
    },
    fronts: {
        sides: basicMetrics.horizontal * 1.5,
        cardContainerHeightExtra: sliderRadius * 2,
        cardSize: toSize(540, 530),
        cardSizeTablet: toSize(650, 725),
        cardSizeTabletShort: toSize(650, 660),
        sliderRadius,
    },
    gridRowSplit: {
        narrow: (width: number) => width * 0.6,
        wide: 200,
    },
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}
