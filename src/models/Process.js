import { Schema, model } from 'mongoose';
import { TYPE_FILTERS } from '../commons/constants.js';

const FiltersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'failed'],
      default: 'in-progress',
    },
  },
  { _id: true },
);

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
    images: {
      type: [
        {
          imageUrl: {
            type: String,
            required: true,
          },
          filters: {
            type: [FiltersSchema],
          },
        },
      ],
    },
  },
  { timestamps: true },
);

const ProcessModel = model('images', ProcessSchema);

export default ProcessModel;
