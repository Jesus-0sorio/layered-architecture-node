import { Router } from 'express';
import applyFiltersHandler from './applyFiltersHandler.js';
import getImagesHandler from './getImagesHandlers.js';
import upload from '../../utils/multerUtils.js';

const router = Router();

router.get('/', (_, res) => {
  res.send('Holi desde filters 😶‍🌫️');
});

router.post('/', upload.array('images[]'), applyFiltersHandler);

router.get('/:id', getImagesHandler);

export default router;
