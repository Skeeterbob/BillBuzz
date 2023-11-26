module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-chart-kit|react-native-linear-gradient|react-native-vector-icons|mobx-react|react-native-plaid-link-sdk|react-native-dropdown-picker|react-native-toast-message)/)',
  ]
};
