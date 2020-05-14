const multer=require('multer');
//const uuid=require('uuid/v4');
const { v1: uuidv1 } = require('uuid');
const MIME_TYPE_MAP={
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',

}
const fileUpload=multer({
    limits:500000,
    storage:multer.diskStorage({
        destination:(req,file,callback)=>{
            callback(null,'uploads/images'); 
        },
        filename:(req,file,callback)=>{
            const extention=MIME_TYPE_MAP[file.mimetype];
            callback(null,uuidv1()+'.'+extention);
        }
    }),
    fileFilter:(req,file,callback)=>{/* This is the validation for the backend , if someone breack throgh the front end ,this filter will still check the uploaded file is really a image.  */
        const isValid=!!MIME_TYPE_MAP[file.mimetype];
        let error=isValid?null:new Error('invalid mime type, are you trying to hack the website!!');
        callback(error,isValid);
    }
});
module.exports=fileUpload;