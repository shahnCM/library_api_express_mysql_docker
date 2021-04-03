const {User, Book, Request, sequelize} = require('../models')
const { Op, QueryTypes } = require('sequelize')
const slugify = require('slugify')
const xlReportSettings = require('../config/worksheet.settings.json')
const {exportExcel} = require('../services/generateReport/xlReportOfBookRequest')
const path = require('path')
const fs = require('fs')
const config = require('config')
const limit = config.get('perPage')

module.exports = {
 
    bookRequest: async function (req, res) {
        // Testing For Admin
        const user = await User.findByPk(req.user.id)
        let data
        try {
            if(user.isAdmin){
                if(req.params.id) {
                    data = await Request.findByPk(req.params.id,{ 
                        include : [Book, 
                            {
                                model : User,
                                as : 'RequestedBy'
                            }, 
                            {
                                model : User,
                                as : 'HandledBy'
                            }
                        ] 
                    })
                    if(!data) {
                        return res.status(404).send('Not Found')            
                    } 
                } else {
                    data = await Request.findAll({ 
                        include : [Book, 
                            {
                                model : User,
                                as : 'RequestedBy'
                            }, 
                            {
                                model : User,
                                as : 'HandledBy'
                            }
                        ],
                        // Must Test This Part Line 47
                        limit: limit,
                        offset: Number(req.query.page) * limit  
                    })
                }
            } else {
                if(req.params.id) {
                    data = await Request.findOne({ where : {
                        id : req.params.id,
                        userId: user.id
                    },
                    include : [Book, 
                        {
                            model : User,
                            as : 'RequestedBy'
                        }, 
                        {
                            model : User,
                            as : 'HandledBy'
                        }
                    ]})
                    if(!data) {
                        return res.status(404).send('Not Found')            
                    } 
                } else {
                    data = await Request.findAll({ where : {
                            userId: user.id
                        },
                        include : [Book, 
                            {
                                model : User,
                                as : 'RequestedBy'
                            }, 
                            {
                                model : User,
                                as : 'HandledBy'
                            }
                        ],
                        limit: limit,
                        offset: Number(req.query.page) * limit 
                    })
                }
            }
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }
        return res.status(200).json(data)
    },

    userBookRequest: async function (req, res) {
        const { id }   = req.params
        let data
        try {
            data = await Request.findAll({ where : {
                    userId: id
                },
                include : [Book, 
                    {
                        model : User,
                        as : 'RequestedBy'
                    }, 
                    {
                        model : User,
                        as : 'HandledBy'
                    }
                ],
                // Must Test Limit
                limit: limit,
                offset: Number(req.query.page) * limit 
            })
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }        
        return res.status(200).json(data)
    },

    handledBookRequest: async function (req, res) {
        const user = await User.findByPk(req.user.id)
        let data
        try {
            if(req.params.id){
                data = await Request.findAll({ where : {
                        handledBy: req.params.id
                    },
                    include : [Book, 
                        {
                            model : User,
                            as : 'RequestedBy'
                        }, 
                        {
                            model : User,
                            as : 'HandledBy'
                        }
                    ],
                    // Must Test This Pagination
                    limit: limit,
                    offset: Number(req.query.page) * limit 
                })
            } else {
                data = await Request.findAll({ where : {
                        handledBy: user.id
                    },
                    include : [Book, 
                        {
                            model : User,
                            as : 'RequestedBy'
                        }, 
                        {
                            model : User,
                            as : 'HandledBy'
                        }
                    ],
                    // Must Test This Pagination
                    limit: limit,
                    offset: Number(req.query.page) * limit 
                })
            }
        } catch(err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        } 
        return res.status(200).json(data)
    },

    createLoanRequest: async function (req, res) {
        const { book_slug } = req.body
        try {
            let book = await Book.findOne({ where : { slug: book_slug } })
            if(!book) {
                return res.status(404).json('Book Not Found')
            }

  /*AWAIT*/ let { trackingId } = await Request.create({
                    bookId: book.id,
                    userId: req.user.id,
                    status: 'pending',
                    requestType: 'loan', // loan Or return
                    trackingId: slugify( req.user.id + ' ' + Math.floor(Date.now() / 99999999999999999999999) + ' ' + book.id  , '-')
                })
            return res.status(201).json({message:'Request Made Successfully', request_tracking_id: trackingId})
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')    
        }        
    },

    createReturnRequest: async function (req, res) {
        const { tracking_id } = req.body
        try {
            let match = await Request.findOne({where : {trackingId: tracking_id}})
            if(!match ){
                return res.status(400).json('Invalid tracking id')
            }
  /*AWAIT*/ Request.create({
                bookId: match.bookId,
                userId: req.user.id,
                status: 'pending',
                requestType: 'return', // 0 for Loan 1 Return
                trackingId: tracking_id
            })
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')    
        }  
        return res.status(200).json('Request Made Successful')      
    },
    
    actionOnBookRequest: async function (req, res) {
        const { id, action } = req.params
        try {
            let request = await Request.findByPk(id)
            if(action === 'accept'){
                request.update({status: 'accepted', handledBy: req.user.id})
            } else if(action === 'reject') {
                request.update({status: 'rejected', handledBy: req.user.id})
            } else if(action === 'await') {
                request.update({status: 'pending', handledBy: req.user.id})
            } else {
                return res.status(403).json('Action Forbidden')
            }
        } catch (error) {
            console.error(error.message)
            return res.status(500).send('Internal Server Error')    
        }        
        return res.status(200).json('Successful')
    }, 

    generateExcelReport: async function (req, res) {
        const { type } = req.params
        let data
        try {
            if(type === 'composite') {
                data = await sequelize.query(
                    `SELECT
                        requests.trackingId AS tracking_id,
                        GROUP_CONCAT(requests.id) AS request_id, 
                        GROUP_CONCAT(users.id) AS user_id,
                        GROUP_CONCAT(users.name) AS user_name,
                        GROUP_CONCAT(books.id) AS book_id,
                        GROUP_CONCAT(books.name) AS book_name, 
                        GROUP_CONCAT(books.slug) AS book_slug,
                        GROUP_CONCAT(requests.requestType) AS request_type,
                        GROUP_CONCAT(requests.status) AS request_status,
                        GROUP_CONCAT(requests.createdAt) AS date_created,
                        GROUP_CONCAT(requests.updatedAt) AS date_updated
                    FROM
                        users 
                        INNER JOIN requests ON 
                        ( requests.userId = users.id)
                        INNER JOIN books ON 
                        ( requests.bookId = books.id)
                        GROUP BY tracking_id`, 
                    { type: QueryTypes.SELECT }
                );
            } else {
                data = await sequelize.query(
                    `SELECT
                        requests.trackingId AS tracking_id,
                        requests.id AS request_id, 
                        users.id AS user_id,
                        users.name AS user_name,
                        books.id AS book_id,
                        books.name AS book_name, 
                        books.slug AS book_slug,
                        requests.requestType AS request_type,
                        requests.status AS request_status,
                        requests.createdAt AS date_created,
                        requests.updatedAt AS date_updated
                    FROM
                        users 
                        INNER JOIN requests ON 
                        ( requests.userId = users.id)
                        INNER JOIN books ON 
                        ( requests.bookId = books.id)`, 
                    { type: QueryTypes.SELECT }
                )


            }
        } catch(err) {
            // console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }        

        const preparedData = 
            await data.map(obj=>Object.keys(obj).map(key => obj[key]))

        const onlyPath = 
            path.join(__dirname, '../', xlReportSettings.filePath, '/')

        const fileName = xlReportSettings.workSheetName + Date.now() + xlReportSettings.extention        
        
        const preparedPath = onlyPath + fileName

        await exportExcel(
            preparedData, 
            xlReportSettings.workSheetColumnNameForBookRequestReport,
            xlReportSettings.workSheetName,
            preparedPath
        )

        res.status(201).download(preparedPath, (e => {
            e ? console.log(e) : console.log('Download Successful')
            fs.unlink(preparedPath, (e => e ? console.log(e) : console.log('Delete Successful')))
        }))
    }

}

