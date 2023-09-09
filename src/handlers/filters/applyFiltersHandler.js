import applyFilters from '../../controllers/filters/applyFilters.js';
import Boom from '@hapi/boom';
import { StatusCodes } from 'http-status-codes';

const applyFiltersHandler = async (req, res, next) => {
  try {
    const payload = req.body;
    const response = await applyFilters(payload);
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    next(Boom.isBoom(e) ? e : Boom.internal(e));
  }
};

export default applyFiltersHandler;
