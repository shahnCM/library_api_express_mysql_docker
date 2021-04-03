const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = {
    
    // Admin has Role 0
    admin: async function(req, res, next) {
        // Get the Token from the header
        // const token = await req.header('x-auth-token')
        // Check if token is available or not
        // if(!token) {
        //     return res.status(401).json('Unauthorized')
        // }
        try {
            // const decoded = await jwt.verify(token, config.get('jwtSecret'))
            let user = await User.findByPk(req.user.id) 
            if(!user.isAdmin) {
                throw new Error('Unauthorized');
            }
            // req.user = await decoded.user
            /* NEXT */next()
        } catch (err) {
            // res.status(401).json(err.message)
            res.status(404).json('Not Found') /* Becauser No One Should Know About Admin Routes */
        }
        
    },
    
    // Admin has Role 1
    user: async function(req, res, next) {
        // Get the Token from the header
        // const token = await req.header('x-auth-token')
        // Check if not token
        // if(!token) {
        //     return res.status(401).json('Unauthorized')
        // }
        try {
            // const decoded = await jwt.verify(token, config.get('jwtSecret'))
            let user = await User.findByPk(req.user.id)
            if(user.isAdmin) {
                throw new Error('Unauthorized');
            }
            // req.user = await decoded.user
            /* NEXT */next()
        } catch (err) {
            res.status(401).json(err.message)
        }
    },    
    
}