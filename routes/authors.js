const express = require('express')
const router = express.Router()
const AuthorController = require('../controllers/AuthorController')
const { check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Role = require('../middlewares/RoleMiddleware')
const Feature = require('../middlewares/FeatureMiddleware')

// @route           GET authors/{id}
// @description     Show Books All or One
// @access          User & Admin
router.get(
    '/:id?', [Auth.pass, Feature.setDefaultPage],
    (req, res) => AuthorController.read(req, res)
)


// @route           POST authors/
// @description     Create An Author Entry
// @access          Admin
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


// @route           PUT authors/:id
// @description     Update An Author Entry
// @access          Admin
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


// @route           DELETE authors/
// @description     DELETE A Author
// @access          Admin
router.delete(
    '/:id', [Auth.pass, Role.admin], 
    (req, res) => AuthorController.delete(req, res)
)

module.exports = router