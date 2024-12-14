//multer handles multip-part data
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {cloudinary} from "./cloudinaryConfig.js";
import path from "path";

//foldername parameter is the folder in Cloudinary where files will be stored
const uploadMiddleware = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        //upload folder path here 
      const folderPath = `${folderName.trim()}`;
      // extract file extension
      const fileExtension = path.extname(file.originalname).substring(1); 
      //give each uploaded file a unique ID when stored in Cloudinary
      const publicId = `${file.fieldname}-${Date.now()}`; 

      return {
        folder: folderPath, //cloudinary folder where file should be stored
        public_id: publicId, //assign unique identifier for file
        format: fileExtension, //file's original format
      };
    },
  });

  //multer instance is configured here to use CloudinaryStorage for file uploads
  return multer({
    storage: storage,
    limits: {
        //keep images size < 5 MB
      fileSize: 5 * 1024 * 1024, 
    },
  });
};

//export middleware for use in routes
export default uploadMiddleware;
