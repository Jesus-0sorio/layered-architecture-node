import dotenv from 'dotenv';
import { startConnection } from './src/mongo/index.js';
import app from './src/app.js';

dotenv.config();

const startServer = async () => {
  await startConnection();
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${process.env.PORT}`);
  });
};

startServer();
