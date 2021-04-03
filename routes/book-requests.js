const express = require('express')
const router = express.Router()
const BookRequestController = require('../controllers/BookRequestController')
const { check, validationResult } = require('express-validator')
const Auth = require('../middlewares/AuthMiddleware')
const Role = require('../middlewares/RoleMiddleware')
const Feature = require('../middlewares/FeatureMiddleware')

// @route           GET /book-requests/users/:id?
// @description     Show Book-Request of specific User
// @access          Admin Only
router.get(
    '/users/:id', [Auth.pass, Role.admin, Feature.setDefaultPage],
    (req, res) => BookRequestController.userBookRequest(req, res)
)

// @route           GET /book-requests/admin
// @description     Show Book-Requests Handled by Logged in Admin
// @access          Admin Only
router.get(
    '/admin/:id?', [Auth.pass, Role.admin, Feature.setDefaultPage],
    (req, res) => BookRequestController.handledBookRequest(req, res)
)

// @route           GET /book-requests/:id?
// @description     Show Book-Request of Logged in User if Logged in as User / Show All if Logged in as Admin : Optional Specification
// @access          User & Admin Role Should be Checked From Header Data match userId from Header data with request in case of user
router.get(
    '/:id?', [Auth.pass, Feature.setDefaultPage],
    (req, res) => BookRequestController.bookRequest(req, res)
)

// @route           POST /book-requests/loan
// @description     Create A Request For Book Loan Request
// @access          User
router.post(
    '/loan', [Auth.pass, Role.user, 
    [
        check('book_slug', 'Book must be selected').not().isEmpty(),
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

        return BookRequestController.createLoanRequest(req, res)
    }
)

// @route           POST /book-requests/return
// @description     Create A Request For Book Return Request
// @access          User
router.post(
    '/return', [Auth.pass, Role.user,  
    [
        check('tracking_id', 'Must provide tracking id').not().isEmpty(),
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

        return BookRequestController.createReturnRequest(req, res)
    }
)

// @route           PUT book-request/:id/:action
// @description     Accept Or Reject A Loan / Return Requests
// @access          Admin
router.put(
    '/:id/take/:action', [Auth.pass, Role.admin], 
    async (req, res) => {
        return BookRequestController.actionOnBookRequest(req, res)
    }
)

// @route           GET book-requests/generate-report
// @description     Generate reports on book-requests
// @access          Admin
router.get(
    '/report/excel/:type?', [Auth.pass, Role.admin],
    async (req, res) => {
        return BookRequestController.generateExcelReport(req, res)
    }
)

module.exports = router
