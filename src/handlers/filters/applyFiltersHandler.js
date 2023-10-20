import Boom from '@hapi/boom';
import { StatusCodes } from 'http-status-codes';

const applyFiltersHandler = async (req, res, next) => {
  try {
    const { filters } = req.body;
    if (!filters) {
      throw Boom.badData('Filters are required');
    }

    const response = await req.container
      .processService.applyFilters({
        filters,
        images: req.files,
      });
    return res.status(StatusCodes.OK).json(response);
  } catch (e) {
    return next(Boom.isBoom(e) ? e : Boom.internal(e));
  }
};

export default applyFiltersHandler;
