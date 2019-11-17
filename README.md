# WIP Dainas Generator

A LSTM (Long Short Term Memory) model that generates Latvian folk songs - Dainas.

- Node script to scrape the training text corpus
- Node script to create and train the model with TensorFlow.js
- React front end app, to generate folk songs

## Building and running on localhost

First install dependencies:

```sh
npm install
```

## Server

To scrape the training data:

```sh
npm build-data
```

To train the model:

```sh
npm build-model
```

## Client

To run the React app:

```sh
npm start
```

To create a production build of the React app:

```sh
npm run build-client
```

## Credits

- Made with [createapp.dev](https://createapp.dev/)
- Uses [TensorFlow.js](https://www.tensorflow.org/js)
