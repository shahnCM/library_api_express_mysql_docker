const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Role = require('../middlewares/RoleMiddleware')



module.exports = router