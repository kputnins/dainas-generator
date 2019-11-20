# WIP Dainas Generator

A LSTM (Long Short Term Memory) model that generates Latvian folk songs - Dainas.

- Node script to scrape the training text corpus
- Node script to create and train the model with TensorFlow.js
- React front end app, to generate folk songs by loading a model and generating data in the browser

## Building and running on localhost

First install dependencies:

```sh
npm install
```

## Node

To scrape the training data:

```sh
npm build-data
```

To train the model:

```sh
npm build-model
```

## Front-end

To run the React app:

```sh
npm start
```

To create a production build of the React app:

```sh
npm run build-client
```

## Note

Due to the limitations of using TensorFlow.js in the browser, a pre-build model has to be loaded from a server using http/https

## Credits

- [createapp.dev](https://createapp.dev/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [TensorFlow.js LSTM Example](https://github.com/tensorflow/tfjs-examples/tree/master/lstm-text-generation)
- [Dainuskapis](http://dainuskapis.lv/)
