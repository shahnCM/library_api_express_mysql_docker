const express = require('express')
const router = express.Router()
const ius = require('../config/imageUpload.settings.json')
const AuthController = require('../controllers/AuthController')
const { body, check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Feature = require('../middlewares/FeatureMiddleware')
const multer = require('multer')
const { fileFilter, storage } = require('../multer/settings')
const upload = multer({
    storage: storage,
    fileFilter : fileFilter        
})

// @route           GET api/auth
// @description     Get Logged in User
// @access          Private
router.get(
    '/user', Auth.pass,
    (req, res) => AuthController.user(req, res)
)

// @route           POST api/auth/register/admin/:key
// @description     Register a Admin
// @access          Public
router.post(
    '/register/admin/:key', [Auth.block, Feature.adminRegistration,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
    ]], 
    async (req, res) => {
        try {
            let errors = await validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
        } catch(e) {
            console.error(e.message)
        }
        return AuthController.registerAdmin(req, res)
    }
)

// @route           POST api/users
// @description     Register a user
// @access          Public
router.post(
    '/register', [Auth.block,
    [
        upload.single('profile_image'),
        body('name', 'Name is Required').not().isEmpty(),
        body('email', 'Enter a Valid Email').isEmail(),
        body('password', 'Enter Password With 6 Or More Characters').isLength({min: 6}),
        body('profile_image').custom(file => {
            if(!file) {
                throw new Error('Profile Image Missing')
            }
            else if(!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
                throw new Error('Unsupported File Type, Only JPEG / PNG Allowed')
            } else if (file.size > Number (ius.sizeLimit)) {
                throw new Error('File Too Large')
            } 
            return true;
        })
    ]], 
    async (req, res) => {
        try {
            let errors = await validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
        } catch(e) {
            console.error(e.message)
        }
        return AuthController.registerUser(req, res)
    }
)

// @route           POST api/auth
// @description     Login User & get Token
// @access          Public
router.post(
    '/login', [Auth.block, 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ]],
    async (req, res) => {
        try {
            errors = await validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
        } catch(e) {
            console.error(e.message)
        }
        return AuthController.authenticateUser(req, res)        
    }
)

module.exports = router