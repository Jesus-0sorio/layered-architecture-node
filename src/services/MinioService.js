import Boom from '@hapi/boom';
import {
  S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { BUCKET_NAME } from '../commons/constants.js';

class MinioService {
  conn = null;

  constructor() {
    if (!this.conn) {
      this.conn = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY,
          secretAccessKey: process.env.MINIO_SECRET_KEY,
        },
        endpoint: process.env.MINIO_HOST,
        forcePathStyle: true,
      });
    }
  }

  async saveImage(image) {
    try {
      // Check if bucket exists
      try {
        await this.conn.send(new HeadBucketCommand({
          Bucket: BUCKET_NAME,
        }));
      } catch (error) {
        if (error.$metadata.httpStatusCode === 404) {
          await this.conn.send(new CreateBucketCommand({
            Bucket: BUCKET_NAME,
          }));
        }
      }

      if (!image) {
        throw Boom.badRequest('Image is required');
      }

      if (!image.originalname) {
        throw Boom.badRequest('Image originalname is required');
      }

      if (!image.buffer) {
        throw Boom.badRequest('Image buffer is required');
      }

      const { originalname, buffer } = image;

      const originalNameParts = originalname.split('.');
      if (originalNameParts.length !== 2) {
        throw Boom.badRequest('Invalid image name');
      }
      const extension = originalNameParts[1];
      const fileName = `${v4()}.${extension}`;
      await this.conn.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
      }));
      return fileName;
    } catch (e) {
      throw Boom.isBoom(e) ? e : Boom.internal('error saving image', e);
    }
  }
}

export default MinioService;
