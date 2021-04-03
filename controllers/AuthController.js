const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config') 
const ius = require('../config/imageUpload.settings.json')
const { checkExists, checkSize, checkType } = require('../multer/settings')

module.exports = {

    user: async function (req, res) {
        let user
        try {
            user = await User.findByPk(req.user.id, {attributes: ['name', 'email', 'profilePic']})
            if(!user) {
                return res.status('401').json("Unauthorized")
            }
        } catch (err) {
            console.error(err.message)
            return res.status(500).send("Internal Server Error")
        }
        res.json({
            user: {
                name: user.name,
                email: user.email,
                profileImageUrl: ius.serverStaticPath + '/' + user.profilePic
            },
            developer: {
                msg: "Client app needs to have the base endpoint of the api"
            },
        })
    },

    registerAdmin: async function(req, res) {
        const {name, email, password} = req.body
        let user
        let authToken
        try {
            user = await User.findOne({ where : { email : email } })
            if(user) {
                return res.status(403).json('User already exists with this Email');
            }
            const salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(password, salt)
            user = await User.create({
                name,
                email,
                password : hashedPassword,
                isAdmin: true
            })  
            const payload = {
                user: {
                    id:     user.id,
                    email:  user.email,
                }
            }
            // Sync
            authToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 })
            // Async
            /*
            jwt.sign(payload, config.get('jwtSecret'), { 
                expiresIn: 360000 
            }, (err, asyncToken) => {
                if(err) 
                    throw err
                
                console.log(asyncToken)
            })
            */
        } catch(error) {
            return res.status(500).json('Internal Server Error')
        }
        return res.status(201).json({ 
            message:    'Admin Registration Successful',
            user:   user,
            token:  authToken
         })
    },

    registerUser: async function(req, res) {
        const {name, email, password} = req.body
        let user
        let authToken
        try {
            user = await User.findOne({ where : { email : email } })
            if(user) {
                return res.status(403).json('User already exists with this Email');
            }

            const salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(password, salt)
            user = await User.create({
                name,
                email,
                password : hashedPassword,
                profilePic: req.file.filename
            })  
            const payload = {
                user: {
                    id:     user.id,
                    email:  user.email,
                }
            }
            // Sync
            authToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 })
            // Async
            /*
            jwt.sign(payload, config.get('jwtSecret'), { 
                expiresIn: 360000 
            }, (err, asyncToken) => {
                if(err) 
                    throw err
                
                console.log(asyncToken)
            })
            */
        } catch(error) {
            return res.status(500).json({ 
                message: 'User Registration Unsuccessful',
                error: error.message
            })
        }
        return res.status(201).json({ 
            message:    'User Registration Successful',
            user: {
                name: user.name,
                email: user.email,
                profileImageUrl: ius.serverStaticPath + '/' + user.profilePic
            },
            developer: {
                msg: "Client app needs to have the base endpoint of the api"
            },
            token:  authToken
         })
    },

    authenticateUser: async function(req, res) {
        const {email, password} = req.body
        let user
        let authToken
        try {
            user = await User.findOne({ where : { email : email } })
            if(!user) {
                return res.status(401).json('Email or Password is Wrong!');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(401).json('Email or Password is Wrong!');
            }
            const payload = {
                user: {
                    id:   user.id,
                    email: user.email
                }
            }
            // Sync
            authToken = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 })
        } catch(error) {
            res.status(500).json('Internal Server Error')
        }
        res.status(200).json({ 
            message:    'Successfully Authenticated',
            user: {
                name: user.name,
                email: user.email,
                profileImageUrl: ius.serverStaticPath + '/' + user.profilePic
            },
            developer: {
                msg: "Client app needs to have the base endpoint of the api"
            },
            token:  authToken
         })        
    }
}