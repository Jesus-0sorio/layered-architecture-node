import applyFilters from '../../controllers/filters/applyFilters.js';
import Boom from '@hapi/boom';
import { StatusCodes } from 'http-status-codes';

const applyFiltersHandler = async (req, res, next) => {
  try {

    console.log(req.files);
    const filters = req.body.filters;

    if (!filters) {
      throw Boom.badData('Filters are required');
    }

    let filtersParsed = null;
    try {
      filtersParsed = JSON.parse(filters);
    } catch (error) {
      throw Boom.badData('Filters are required');
    }

    console.log(filtersParsed);

    const response = await applyFilters({
      filters: filtersParsed,
      files: req.files,
    });
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    next(Boom.isBoom(e) ? e : Boom.internal(e));
  }
};

export default applyFiltersHandler;
