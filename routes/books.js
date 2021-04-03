const express = require('express')
const router = express.Router()
const BookController = require('../controllers/BookController')
const { check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Role = require('../middlewares/RoleMiddleware')
const Feature = require('../middlewares/FeatureMiddleware')

// @route           GET books/:id?
// @description     Show Books All or One
// @access          User & Admin
router.get( // Add Pagination Here ?page=1/:id?
    '/:id?', [Auth.pass, Feature.setDefaultPage],
    (req, res) => BookController.read(req, res)
)

// @route           POST books/
// @description     Create A Book Entry
// @access          Admin
router.post(
    '/', [Auth.pass, Role.admin,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('authors', 'Must provide authors').not().isEmpty()
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

        return BookController.create(req, res)
    }
)

// @route           PUT books/
// @description     Update A Book Entry
// @access          Admin
router.put(
    '/:id', [Auth.pass, Role.admin,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('authors', 'Must provide authors').not().isEmpty()
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

        return BookController.update(req, res)
    }
)

// @route           DELETE books/
// @description     DELETE A Book Entry
// @access          Admin
router.delete(
    '/:id', [Auth.pass, Role.admin], 
    (req, res) => BookController.delete(req, res)
)

module.exports = router