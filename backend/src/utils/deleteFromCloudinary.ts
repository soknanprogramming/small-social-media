import cloudinary from '../config/cloudinary';

export const deleteFromCloudinary = (public_id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error);
      resolve();
    });
  });
};
