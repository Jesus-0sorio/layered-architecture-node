import Express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import filtersRouter from './src/handlers/filters/index.js';
import { startConnection } from './src/mongo/index.js';
import Boom from '@hapi/boom';

dotenv.config();

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Holi 😶‍🌫️');
});

app.use('/images', filtersRouter);

app.use((err, _, res, next) => {
  if (err) {
    let error = Boom.isBoom(err) ? err : Boom.internal(err);
    const statusCode = error.output.statusCode;
    const payload = error.output.payload;
    return res.status(statusCode).json(payload);
  }
  return next;
});

(async () => {
  try {
    await startConnection();
  } catch (e) {
    console.log(e);
  }
})();

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
