const express = require('express')
const router = express.Router()
const AuthorController = require('../controllers/AuthorController')
const { check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Role = require('../middlewares/RoleMiddleware')
const Feature = require('../middlewares/FeatureMiddleware')


router.get(
    '/:id?', [Auth.pass, Feature.setDefaultPage],
    (req, res) => AuthorController.read(req, res)
)


router.post(
    '/', [Auth.pass, Role.admin,
    [
        check('name', 'Name is required').not().isEmpty()
    ]],
    async (req, res) => {
        try {
            const errors = await validationResult(req)
        
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
        }
        catch (e) {
            console.error(e.message)
        }

        return AuthorController.create(req, res)
    }
)


router.put(
    '/:id', [Auth.pass, Role.admin, 
    [
        check('name', 'Name is required').not().isEmpty()
    ]],
    async (req, res) => {
        try {
            const errors = await validationResult(req)
        
            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array()
                })
            }
        }
        catch (e) {
            console.error(e.message)
        }

        return AuthorController.update(req, res)
    }
)


router.delete(
    '/:id', [Auth.pass, Role.admin], 
    (req, res) => AuthorController.delete(req, res)
)

module.exports = router