const {Author, Book, AuthorBook} = require('../models')
const slugify = require('slugify')
const config = require('config')
const limit = config.get('perPage')

module.exports = {
 
    create: async function (req, res) {
        const { name } = req.body
        const slug = slugify( name + ' ' + Math.floor(Date.now() / 1000) , '-')
        try {
            let book = await Book.create({name, slug});
            if(req.body.authors) {
                let authorIds = req.body.authors
                // Handling the Pivot Table Asynchronously
                authorIds.forEach( authorId => {
                     AuthorBook.create({authorId: authorId, bookId: book.id})
                })
                return res.status(201).json('Success')
            } 
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }
    },

    read: async function (req, res) {
        const { id }   = req.params
        let data
        try {
            if(req.params.id) {
                data = await Book.findByPk(id, { include : [Author] })
            } else {
                data = await Book.findAll({
                    order : [['name', 'asc']],
                    include : [Author],
                    limit: limit,
                    offset: Number(req.query.page) * limit 
                })
                return res.status(200).json(data)
            }
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }        
    },

    update: async function (req, res) {
        const { id }   = req.params
        const { name } = req.body
        const slug = slugify( name + ' ' +Math.floor(Date.now() / 1000) , '-')
        try {
            let book = await Book.findByPk(id)
            if(!book) {
                return res.status(404).json('Book Not Found')
            }
            book.update({ name: name, slug: slug }) //, { where: { id : id } } // ASYNC
            if(req.body.authors) {
                let authorIds = req.body.authors
                await AuthorBook.destroy({ where : { bookId: book.id }})
                authorIds.forEach( authorId => {
                     AuthorBook.create({authorId: authorId, bookId: book.id})
                })
                return res.status(202).json('Success')
            }
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')    
        }
    },

    delete: async function (req, res) {
        try {
            const { id } = req.params
            let book = await Book.findByPk(id)
            if(!book) {
                return res.status(404).json({ msg: 'Book Not Found' })
            }
            /** We have OnDelete Cascade So No Need to Delete From Pivot Table
              * await AuthorBook.destroy({ where : { bookId: book.id }})
              */
            await Book.destroy({ where : { id : id }})
            res.status(204).json({ msg: 'Deleted Successfully' })
        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')    
        }        

    }

}