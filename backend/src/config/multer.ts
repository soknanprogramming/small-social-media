import multer from 'multer';

// Use memory storage — we stream the buffer directly to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    file.mimetype.startsWith('image/') // Accept only image files
      ? cb(null, true)
      : cb(new Error('Only image files are allowed'));
  },
});