const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
require('dotenv').config()
// Passport config
require('./config/passport')(passport)
// DB config
const dataBase = require('./config/key').mongoURI
// Database Connect
mongoose.connect(dataBase,{useNewUrlParser:true, useUnifiedTopology:true})
 .then(()=>console.log('MongoDB connected'))
 .catch(err =>console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')
// Global vars
app.set('trust proxy', 1)
app.use(session({
    name:process.env.SESSION_NAME,
    secret:'secret',
    store:MongoStore.create({
        mongoUrl: `mongodb+srv://satya:${process.env.DB_PASSWORD}@cluster1.axlso.mongodb.net/Cluster1?retryWrites=true&w=majority`,
        
    }),
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge: process.env.SESSION_LIFETIME,
        sameSite: true,
        secure: process.env.IN_PRODUCTION
    }
}))
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
// Flash messages
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})
// Bodyparser
app.use(express.urlencoded({extended:false}))
// Routes
app.use('/',require('./routes/index'))
app.use('/users', require('./routes/users'))

// To use .css file in EJS
app.use(express.static( __dirname + '/public'))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log('Server Runinng...')
})

