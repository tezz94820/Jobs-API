const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError , UnauthenticatedError } = require('../errors/index.js')

const register = async (req,res) => {
    const user = await User.create({...req.body})
    const token = user.createJWT()      //token generated in the instance methods in the userSchema model
    res.status(StatusCodes.CREATED).json({user:{name:user.name} , token})
}

const login = async (req,res) => {
    
    const {email,password} = req.body
    if(!email , !password){
        throw new BadRequestError('please provide valid email and password')
    }

    //finding the person with the specified email
    const user = await User.findOne({email})
    if(!user){  //if user is not found
        throw new UnauthenticatedError("Invalid Credentials")
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid Credentials")
    }

    //last to create token and send the token and username
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name} , token})
}

module.exports = {register , login}