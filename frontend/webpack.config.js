const path = require('path');

module.exports = {
  entry: './src/index.js', // Входная точка вашего приложения
  output: {
    path: path.resolve(__dirname, 'build'), // Директория для сборки
    filename: 'bundle.js', // Имя собранного файла
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Загрузчик для транспиляции кода
        },
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    port: 5001, // Порт для Dev Server
    allowedHosts: [
      'vashazabota.ru', // Ваш домен
    ],
  },
};

