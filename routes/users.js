const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../model/User');
const passport = require('passport');
const {forwardAuthenticated} = require('../config/auth')
// Register Router
router.get('/register',forwardAuthenticated,(req,res)=>{
    res.render('register')
})
// Login Router
router.get('/login',forwardAuthenticated,(req,res)=>{
    res.render('login')
})

// Register Handale
router.post('/register',(req,res)=>{

   const {name,email,password,password2} = req.body
   let errors = []
   //Password less than 6 charecter
   if(password.length <= 6 && password2.length <= 6){
    errors.push({msg:'Password must be at least 6 characters'})
   }
   //fields are empty
   if(!name || !email || !password || !password2){
       errors.push({msg:'Please fill the fields'})
   }
   //Password match
   if(password !== password2){
       errors.push({msg:'Passoword does not match'})
   }
   // If any of the error happens
   if(errors.length > 0){
      res.render('register',{
          errors,
          name,
          email,
          password,
          password2,
          
      })
   } else{
       User.findOne({email:email})
        .then(user=>{
            //user alreday exist
            if(user){
                errors.push({msg:'This email is already registered'})
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } 
            else{
               const newUser = new User({
                    name,
                    email,
                    password
                })
                //Hash password
                bcrypt.genSalt(10,(err,salt)=>{

                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err
                        newUser.password = hash
                        newUser.save()
                         .then(user=>{
                             req.flash('success_msg','You have successfully registered')
                             res.redirect('/users/login')
                         })
                         .catch(err=>console.error(err))
                    })
                })
            }
        })
        .catch(err=>console.log(err))
   }
})

// Login handale
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next)
})
// Logout Handale
router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success_msg','You have successfully logged out')
    res.redirect('/users/login')
})
module.exports = router