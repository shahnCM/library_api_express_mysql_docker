const express = require('express')
const helmet = require('helmet')
const { sequelize } = require('./models')
const path = require('path')
const ius = require('./config/imageUpload.settings.json')
const app = express()
const Auth = require('./middlewares/AuthMiddleware')

// Connect DB
sequelize.authenticate()
    .then( _ => console.log("MySql Connection Successful"))
    .catch( error => console.error('Database Connection Error: ',JSON.stringify(error)))

// Initiating Plugins    
app.use(helmet());
app.use(express.urlencoded( { extended: false } ))    
app.use(express.json( { extended: false } ))
app.use(ius.serverStaticPath, Auth.pass, express.static(path.join(__dirname, ius.userProfileImagePath)))

// Define Routes
app.use('/api/auth',       require('./routes/auth'))
app.use('/api/books',      require('./routes/books'))
app.use('/api/authors',    require('./routes/authors'))
app.use('/api/search',     require('./routes/search'))
app.use('/api/book-loans', require('./routes/book-requests'))

app.use(function (req, res, next) {
    res.status(404).send("Not Found !")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));