import multer from "multer";

// temporary storage to save image before database
const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");