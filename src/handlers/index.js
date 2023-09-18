import { Router } from 'express';
import applyFiltersHandler from './filters/applyFiltersHandler.js';
import upload from '../utils/multerUtils.js';

const router = Router();

router.get('/', (_, res) => {
  res.send('Holi desde filters 😶‍🌫️');
});

router.post('/', upload.array('images[]'), applyFiltersHandler);

export default router;
