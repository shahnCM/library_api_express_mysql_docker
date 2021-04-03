const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = {
    
    // Admin has Role 0
    adminRegistration: async function(req, res, next) {
        try {
            if(config.get("adminRegistrationOn") && 
            req.params.key === 
            config.get("adminRegistrationSecret")) 
            {
                next()
            }
            else {
                throw new Error("Not Found")
            }
        } catch (err) {
            return res.status(404).json(err.message)
        }
    },

    setDefaultPage: async function(req, res, next) {
        try {
            if(!req.query.page){
                req.query.page = 0
            }
        } catch (err) {
            return res.status(500).json('Internal Server Error: Check default pagination')
        }
        next()
    },    
    
}