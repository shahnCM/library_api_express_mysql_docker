const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('../models')

module.exports = {

    pass: async function(req, res, next) {
        // Get the Token from the header
        let user
        try {
            const token = await req.header(config.get('jwtTokenName'))
            // Check if not token
            if(!token) {
                throw new Error()
            }
            const decoded = await jwt.verify(token, config.get('jwtSecret'))
            user = decoded.user // Adding User in the request
            if(config.get('hardPass') === true) {
                user = await User.findByPk(user.id)
                if(!user) {
                    throw new Error()
                } else {
                    req.user = user
                }
            } else {
                req.user = user
            }
            /* NEXT */next()
        } catch (err) {
            res.status(401).json('Unauthorized')
        }
        
    },

    block: async function(req, res, next) {
        // Get the Token from the header
        const token = await req.header(config.get('jwtTokenName'))
        let tokenIsValid
        // Check if not token
        if(token) {
            try {
                tokenIsValid = await jwt.verify(token, config.get('jwtSecret'))
            } catch (err) {
                tokenIsValid = false
            }
        }
        if(tokenIsValid) {
            return res.status(401).json('Unauthorized')
        } else {
            next()
        }
    },
      
}