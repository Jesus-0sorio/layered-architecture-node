import multer from 'multer';
import Boom from '@hapi/boom';
import { v4 } from 'uuid';

const imagesType = ['image/png'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 52428800,
  },
  fileFilter: (_, file, cb) => {
    if (imagesType.includes(file.mimetype)) {
      const originalNameParts = file.originalname.split('.');
      const extension = originalNameParts[1];
      const fileName = `${v4()}.${extension}`;
      // eslint-disable-next-line no-param-reassign
      file.originalname = fileName;
      cb(null, true);
    } else {
      const errorMessage = `Only ${imagesType.join(
        ', ',
      )} mime-types are allowed`;
      const error = Boom.badData(errorMessage);
      cb(error, false);
    }
  },
});

export default upload;
