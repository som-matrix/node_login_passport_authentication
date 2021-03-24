const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../model/User')

// Local Strategy
module.exports = function(passport){

   passport.use(

    new LocalStrategy({usernameField:'email'},(email,password,done)=>{
        User.findOne({email:email})
         .then(user=>{
           if(!user){
             return  done(null,false,{message:'Email is not registered!'})
           }else{
             bcrypt.compare(password,user.password,(err,isMatch)=>{
                 if(err) throw err

                 if(isMatch){
                   return done(null,user)
                 }
                 else{
                     return done(null,false,{message:'Password is incorrect'})
                 }
             })
           }
         })
         .catch(err=>console.error(err))
    })
   )
   // Serialize means we provide the user id as an refrence to the local passport 
   passport.serializeUser((user,done)=>{
       done(null,user.id)
   })
   // As the id has been provided as an refrence , hence this user.id will be used by the deserialize
   // user to reterive back the whole object
   passport.deserializeUser((id,done)=>{
       User.findById(id,(err,user)=>{
           done(err,user)
       })
   })
}