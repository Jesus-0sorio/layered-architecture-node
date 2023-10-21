import Boom from '@hapi/boom';
import { StatusCodes } from 'http-status-codes';

const getImagesHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const process = await req.container.processService.getProcessById(id);
    return res.status(StatusCodes.OK).json(process);
  } catch (e) {
    return next(Boom.isBoom(e) ? e : Boom.internal(e));
  }
};

export default getImagesHandler;
