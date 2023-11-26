module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-chart-kit)/)',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
};