import multer from 'multer';
import { AppError } from '../utils/errorHandler';

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

export const uploadProof = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(
        new AppError({
          message: 'Tipo de ficheiro não permitido. Use JPG, PNG, WebP ou PDF.',
          statusCode: 400,
          code: 'INVALID_FILE_TYPE',
        })
      );
    }
    cb(null, true);
  },
}).single('file');
