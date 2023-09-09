import { Schema, model } from 'mongoose';
import { TYPE_FILTERS } from '../commons/constants.js';

const ProcessSchema = new Schema(
  {
    filters: {
      type: [
        {
          type: String,
          enum: TYPE_FILTERS,
          required: true,
        },
      ],
    },
  },
  { timestamps: true }
);

const ProcessModel = model('images', ProcessSchema);

export default ProcessModel;
