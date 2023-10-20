import ProcessRepository from '../repositories/ProcessRepository.js';
import MinioService from '../services/MinioService.js';
import ProcessService from '../services/ProcessService.js';

const buildContainer = (req, _, next) => {
  const container = {};
  const processRepository = new ProcessRepository();
  const minioService = new MinioService();
  const processService = new ProcessService({ processRepository, minioService });

  container.processService = processService;

  req.container = container;
  return next();
};

export default buildContainer;
