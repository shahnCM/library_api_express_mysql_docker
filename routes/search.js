const express = require('express')
const router = express.Router()
const SearchController = require('../controllers/SearchController')
const { check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Role = require('../middlewares/RoleMiddleware')
const Feature = require('../middlewares/FeatureMiddleware')


router.post(
    '/by-any', [Auth.pass, Feature.setDefaultPage,
    [
        check('key', 'Search Key is required').not().isEmpty()
    ]],
    (req, res) => SearchController.findByAny(req, res)
)


router.post(
    '/by-book', [Auth.pass, Feature.setDefaultPage,
    [
        check('key', 'Search Key is required').not().isEmpty()
    ]],
    (req, res) => SearchController.findByBook(req, res)
)


router.post(
    '/by-author', [Auth.pass, Feature.setDefaultPage,
    [
        check('key', 'Search Key is required').not().isEmpty()
    ]],
    (req, res) => SearchController.findByAuthor(req, res)
)

module.exports = router;