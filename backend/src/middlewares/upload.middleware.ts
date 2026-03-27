import { upload } from '../config/multer';

export const uploadSingle = upload.single('photo');