const {Author, Book} = require('../models')
const config = require('config')
const limit = config.get('perPage')

module.exports = {
 
    create: async function (req, res) {
        const { name } = req.body
        try {
            Author.create({name});
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
        return res.status(201).json('Success')
    },

    read: async function (req, res) {
        const { id } = req.params
        let data
        try {
            if(req.params.id) {
                data = await Author.findByPk(id, { include : [Book] })
            } else {
                data = await Author.findAll({
                    order : [['name', 'asc']],
                    include : [Book],
                    limit: limit,
                    offset: Number(req.query.page) * limit 
                })
            }
        } catch(err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
        return res.status(200).json({authors: data})        
    },

    update: async function (req, res) {
        const { id }   = req.params
        const { name } = req.body
        try {
            let author = await Author.findByPk(id)
            if(!author) {
                return res.status(404).json('Author Not Found')
            }
            author.update({ name: name })
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')    
        }
        return res.status(202).json('Update Successful')
    },

    delete: async function (req, res) {
        const { id } = req.params
        try {
            let author = await Author.findByPk(id)
            if(!author) {
                return res.status(404).json({ msg: 'Author Not Found' })
            }
            /** We have OnDelete Cascade So No Need to Delete From Pivot Table
              * await AuthorBook.destroy({ where : { authorId: author.id }})
              */
            Author.destroy({ where : { id : id }})
        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')    
        }        
        return res.status(204).json()
    }

}