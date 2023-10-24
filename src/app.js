import Express from 'express';
import bodyParser from 'body-parser';
import Boom from '@hapi/boom';
import dotenv from 'dotenv';
import filtersRouter from './handlers/filters/index.js';
import buildContainer from './container/buildContainer.js';

dotenv.config();

const app = Express();

app.use(bodyParser.json());
app.use(buildContainer);

app.get('/', (_, res) => {
  res.send('Holi 😶‍🌫️');
});

app.use('/images', filtersRouter);

app.use((err, _, res, next) => {
  if (err) {
    const error = Boom.isBoom(err) ? err : Boom.internal(err);
    const { statusCode } = error.output;
    const { payload } = error.output;
    payload.stack = error.stack;
    return res.status(statusCode).json(payload);
  }
  return next();
});

export default app;
