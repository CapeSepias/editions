module.exports = {
    preset: 'react-native',
    transformIgnorePatterns: ['/node_modules/(?!(@guardian|react-native))/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
}
