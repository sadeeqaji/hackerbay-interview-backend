const express = require('express');
const morgan = require('morgan');
const Router = express.Router();
const logger = require('./logger');

const appRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

app.use('/api', appRoutes(Router));

app.use((req, res, next) => {
  res.status(404).send({
    message: 'Route Not Found'
  });
});

app.use((error, req, res, next) => {
  logger.error(error);
  const status = error.status || 500;
  res.status(status).send({
    message: error.message || 'Internal Server Error',
    data: null,
    error: error
  });
});

module.exports = app;
