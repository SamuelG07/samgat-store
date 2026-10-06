import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Faz upload de um buffer para o Cloudinary
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'samgat/proofs'
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
        max_bytes: 5 * 1024 * 1024,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload falhou'));
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Remove um ficheiro do Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
