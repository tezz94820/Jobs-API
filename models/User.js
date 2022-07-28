const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const UserSchema = new mongoose.Schema({
    name:{
        type:String ,
        required:[true,'please provide your name'],
        minLength:3,
        maxLength:50
    } ,

    email:{
        type:String ,
        required:[true,'please provide your email'],
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ] ,
        //match helps to check a particulear regex .or any other pattern
        unique:true,        // just makes an uniqie index to every email.so that any user cannot repeat the email
    } ,

    password:{
        type:String ,
        required:[true,'please provide password'],
        minLength:3,
    } 
})


//encryption of password
    //here we generate a salt i.e, a random alphabets that are combined with the passwpord and finally hashed.
    //genSalt(10) makes 10 different alphabet salt.10 number  iss good and secure .
    //bcrypt.hash() method hashes by taking password and salt
UserSchema.pre('save' , async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password  = await bcrypt.hash(this.password , salt)
    // next()
})
//pre is a middleware which will execute just before saving the document in the mongodb database.
// so the password will be hashed pre saving in the database 
//this is a middleware but it can work without the next() as well.



//this is an instance methods.simply this are the function being declared on a userscgema.
//this keyword points to the user which is going onn.
UserSchema.methods.createJWT = function(){
    const token = jwt.sign({userId:this._id , name:this.name} , process.env.JWT_SECRET , {expiresIn:process.env.JWT_LIFETIME})
    return token
}

//another instance method for comparing password which is used in login controller
UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword , this.password)
    return isMatch
}
//here the candidatePassword is hashed then compared to the hashed passweord in the database.



module.exports = mongoose.model('User' , UserSchema)

//Note :- always make instance methods with function keyword and not array function .
//by doing so we are keeping the scope of the user up to this file only