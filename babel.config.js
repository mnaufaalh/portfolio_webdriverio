module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 14
      }
    }]
  ],

  plugins: [
    [require.resolve('babel-plugin-module-resolver'), {
      root: ['./tests'],
      alias: {
        helpers: './tests/helpers',
        pageobjects: './tests/pageobjects',
        flows: './tests/flows',
        fixtures: './tests/fixtures'
      }
    }]
  ]
};
