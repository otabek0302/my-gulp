const webpackConfig = {
  mode: 'production',
  entry: {
    index: './src/js/index.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

export default webpackConfig;
