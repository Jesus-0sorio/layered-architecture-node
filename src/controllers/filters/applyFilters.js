import Process from '../../models/Process.js';
import Joi from 'joi';
import Boom from '@hapi/boom';
import { FILTERS } from '../../commons/constants.js';

const PayloadValidation = Joi.object({
  filters: Joi.array()
    .min(1)
    .items(
      Joi.string().valid(FILTERS.NEGATIVE, FILTERS.GREYSCALE, FILTERS.BLUR)
    ),
  files: Joi.array().required(),
});

const applyFilters = async (payload) => {
  try {
    await PayloadValidation.validateAsync(payload);
  } catch (e) {
    throw Boom.badData(e.message, { e });
  }
  const newProcess = new Process(payload);
  await newProcess.save();
  return newProcess;
};

export default applyFilters;
