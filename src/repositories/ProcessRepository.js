/* eslint-disable class-methods-use-this */
import ProcessModel from '../models/Process.js';

class ProcessRepository {
  async save(process) {
    const newProcess = new ProcessModel(process);
    newProcess.filters = process.filters;
    newProcess.images = process.images;
    await newProcess.save();
    return newProcess;
  }

  async getById(id) {
    const newProcess = await ProcessModel.findById(id);
    return newProcess;
  }

  async updateOne(id, data, option = { new: true }) {
    await ProcessModel.findOneAndUpdate(id, data, option);
  }
}

export default ProcessRepository;
