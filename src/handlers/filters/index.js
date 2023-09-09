import { Router } from 'express';
import applyFiltersHandler from './applyFiltersHandler.js';

const router = Router();

router.get('/', (_, res) => {
  res.send('Holi desde filters 😶‍🌫️');
});

router.post('/', applyFiltersHandler);

export default router;
