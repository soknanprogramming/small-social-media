import { upload } from '../config/multer';

// export const uploadSingle = upload.single('photo');

export const uploadSingle = (filename: string) => {
  return upload.single(filename);
}
