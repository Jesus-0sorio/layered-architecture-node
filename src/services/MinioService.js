import Boom from '@hapi/boom';
import {
  S3Client, PutObjectCommand, HeadBucketCommand, CreateBucketCommand, GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

      const { originalname, buffer } = image;
      await this.conn.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: originalname,
        Body: buffer,
      }));
      return originalname;
    } catch (e) {
      throw Boom.isBoom(e) ? e : Boom.internal('error saving image', e);
    }
  }

  async generateSignedUrl(imageName) {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageName,
      });
      const url = await getSignedUrl(this.conn, command, { expiresIn: 86400 });
      return url;
    } catch (e) {
      throw Boom.isBoom(e) ? e : Boom.internal('error generating signed url', e);
    }
  }
}

export default MinioService;
