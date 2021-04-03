const {sequelize, Author, Book} = require('../models')
const { QueryTypes, Op  } = require('sequelize')
const config = require('config')
const limit = config.get('perPage')

module.exports = {

    findByAny: async function (req, res) {
        const { key }   = req.body
        let data
        try {
            data = await sequelize.query(
                `SELECT
                    books.id AS book_id,
                    books.name AS book_name,    
                    books.slug AS book_slug, 
                    GROUP_CONCAT(authors.name) AS book_authors
                FROM
                    authorbook 
                    INNER JOIN books ON 
                    ( authorbook.bookId = books.id)
                    INNER JOIN authors ON 
                    ( authorbook.authorId = authors.id)
                WHERE 
                books.name LIKE '%${key}%' OR 
                authors.name LIKE '%${key}%'
                GROUP BY books.id
                LIMIT ${limit} OFFSET ${req.query.page}`, 
                { type: QueryTypes.SELECT }
            );
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }        
        return res.status(200).json(data)
    },

    findByBook: async function (req, res) {
        const { key }   = req.body
        let data
        try {
            data = await Book.findAll({
                where: {
                    name : { [Op.like] : `%${key}%`}
                }, 
                // include : [Author],
                limit: limit,
                offset: Number(req.query.page) * limit  
            })
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }       
        return res.status(200).json(data) 
    },

    findByAuthor: async function (req, res) {
        const { key }   = req.body
        let data
        try {
            let author = await Author.findOne({
                where: {
                    name : { [Op.like] : `%${key}%`}
                },
                include : [Book]  
            })
            data = author.Books
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }        
        return res.status(200).json(data)
    },
}    



/*

            let data = await sequelize.query(
                `SELECT
                    books.id AS id,
                    books.name AS book, 
                    books.slug AS slug, 
                    authors.name AS author
                FROM
                    authorbook 
                    INNER JOIN books ON ( authorbook.bookId = books.id)
                    INNER JOIN authors ON ( authorbook.authorId = authors.id)
                WHERE 
                books.name LIKE '%${key}%' OR authors.name LIKE '%${key}%'`, 
                { type: QueryTypes.SELECT }
            );

*/