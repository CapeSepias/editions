import React from 'react'
import { Editions } from 'src/components/icons/Editions'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { color } from 'src/theme/color'
import { LeftChevron } from 'src/components/icons/LeftChevron'
import { getFont } from 'src/theme/typography'
import { metrics } from 'src/theme/spacing'

const styles = (selected: boolean) =>
    StyleSheet.create({
        button: {
            backgroundColor: selected
                ? color.palette.sport.pastel
                : 'transparent',
            borderRadius: 24,
            justifyContent: 'center',
            height: 42,
            width: 42,
            marginLeft: metrics.horizontal,
        },
        chevronContainer: { alignSelf: 'center' },
        iconContainer: {
            top: 8,
            height: 60,
            justifyContent: 'space-between',
            width: 90,
            marginRight: metrics.horizontal,
        },
        label: { color: 'white', ...getFont('sans', 0.5), fontSize: 14 },
    })

const EditionsMenuButton = ({
    onPress,
    selected = false,
}: {
    onPress: () => void
    selected?: boolean
}) => (
    <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Regions and specials editions menu"
        onPress={onPress}
        style={styles(selected).button}
    >
        {selected ? (
            <View style={styles(selected).chevronContainer}>
                <LeftChevron />
            </View>
        ) : (
            <View style={styles(selected).iconContainer}>
                <Editions />
                <Text style={styles(selected).label}>Editions</Text>
            </View>
        )}
    </TouchableOpacity>
)

export { EditionsMenuButton }
