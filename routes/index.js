const express = require('express')
const router = express.Router()
const {ensureAuthenticated,forwardAuthenticated} = require('../config/auth')
// Welcome page or Home page
router.get('/',forwardAuthenticated,(req,res)=>{
    res.render('welcome')
})

// Dashboard page or the resource page after the login 
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
       user: req.user
    })
})

module.exports = router