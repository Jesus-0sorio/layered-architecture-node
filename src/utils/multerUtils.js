import multer from 'multer';
import { extname } from 'path';
import Boom from '@hapi/boom';

const imagesType = ['image/png'];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_, file, cb) => {
    if (imagesType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const errorMessage = `Only ${imagesType.join(
        ', '
      )} mimetypes are allowed`;
      const error = Boom.badData(errorMessage);
      cb(error);
    }
  },
  limits: {
    fileSize: 31457280,
  },
});

export default upload;
