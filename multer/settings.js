const ius = require('../config/imageUpload.settings.json')
const slugify = require('slugify')
const { User } = require('../models')
const multer = require('multer')

const fileFilter = async (req, file, cb)=> {   
    const { name, email, password } = req.body
    const contentLength = req.headers['content-length'] 
    // This function is never called when image file is not provided
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        req.body = { ...req.body, profile_image : { mimetype : file.mimetype, size : contentLength } }
           // This tricks Express Validator As It can not validate file. 
          // We set this property to the profile_image field 
         // In this way the profile image field stays not null
        if(contentLength > Number (ius.sizeLimit)) {
        // Prevents Image Upload if File Size Exceeds.
            cb(null, false)
            return false
        }
        if (!name || !email || !password) {
        // Prevents Upload Process if any form field is missing Even When Image is OK.    
            cb(null, false)
            return false
        }
        else if(await User.findOne({where: {email : email}})) {
        // Prevents Upload Process if Email is not Unique Even When Image is OK.    
            cb(null, false)
            return false
        }
        return cb(null, true)
    } 
    req.body = { ...req.body, profile_image : { mimetype : null, size : contentLength } }
    return cb(null, false)
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, ius.userProfileImagePath)
    },
    filename: async function(req, file, cb) {
        let fileName  = await slugify( req.body.name + ' ' + Math.floor(Date.now() / 1000) , '-')
        let extension = await file.originalname.split(".")
        cb(null, fileName + '.' + extension[extension.length - 1])
    }
})

/*
const checkExists = (req, cb) => {
    if(!req.file) {
        console.error("Image is required")
        err = {
            status: 400,
            message: "Image is required"
        } 
        cb(err)
        return false        
    }
    req.body.profile_image = "Exists" // This tricks Express Validator
    return true
}

const checkSize = (req, cb) => {
    if (req.file && req.file.size > Number (ius.sizeLimit)) {
        console.error("File Size Exceeded")
        err = {
            status: 403,
            message: "Image Too Large"
        } 
        cb(err)
        return false   
    }
    req.body.profile_image = "Exists" // This tricks Express Validator 
    
    return true
}

const checkType = (req, cb) => {
    if(req.file && req.file.mimetype !== 'image/jpeg' || req.file.mimetype !== 'image/png'){
        err = {
            status: 415,
            message: "Invalid Image Type"
        }
        cb(err)
        return false
    } 
    req.body.profile_image = "Exists" // This tricks Express Validator
    return true
}
*/
module.exports = {
    storage,
    fileFilter,
    // checkExists,
    // checkType 
}