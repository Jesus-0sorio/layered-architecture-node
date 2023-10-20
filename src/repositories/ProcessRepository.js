import ProcessModel from '../models/Process.js';

class ProcessRepository {
  // eslint-disable-next-line class-methods-use-this
  async save(process) {
    const newProcess = new ProcessModel(process);
    newProcess.filters = process.filters;
    await newProcess.save();
    return newProcess;
  }
}

export default ProcessRepository;
