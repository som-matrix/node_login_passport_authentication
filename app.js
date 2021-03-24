const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();
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
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
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

