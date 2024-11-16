// src/cloudinary/cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly config: any) {
    cloudinary.config(this.config);
  }

  async uploadImage(file: Express.Multer.File, folderName: string, publicId?: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const options: any = { folder: folderName };
      if (publicId) {
        options.public_id = publicId;
      }

      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<{ result: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
