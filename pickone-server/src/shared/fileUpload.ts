import { randomBytes } from 'crypto';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import config from '../config';
import ApiError from '../errors/ApiError';

const uploadSingleFile = async (
   file: Express.Multer.File,
   folder: string
): Promise<string> => {
   if (!file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'File data is missing');
   }

   // Sanitize filename
   const sanitizedFilename = file.originalname
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w.-]/g, '');

   // Generate unique filename
   const filename = `${randomBytes(4).toString('hex')}-${sanitizedFilename}`;

   // Use absolute path for Vercel
   const tmpFolderPath = path.join('/tmp');
   const localPath = path.join(tmpFolderPath, folder, filename);

   // Ensure directory exists (no error if already exists)
   await fs.promises.mkdir(path.dirname(localPath), { recursive: true });

   // Write file
   await fs.promises.writeFile(localPath, file.buffer);

   // Return URL that matches your static route
   return `${config.local_file_url}tmp/${folder}/${filename}`;
};

const uploadManyFile = async (
   files: Express.Multer.File[],
   folder: string
): Promise<string[]> => {
   const uploadPromises = files.map(file => uploadSingleFile(file, folder));
   return await Promise.all(uploadPromises);
};

const deleteSingleFile = async (url: string): Promise<void> => {
   const filePath = path.join(__dirname, '../../', url);

   if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
   }
};

const deleteManyFile = async (urls: string[]): Promise<void> => {
   await Promise.all(urls.map(url => deleteSingleFile(url)));
};

export const ImageUploadService = {
   uploadSingleFile,
   uploadManyFile,
   deleteSingleFile,
   deleteManyFile,
};
