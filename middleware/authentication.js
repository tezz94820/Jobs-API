const User = require('../models/User')
const {UnauthenticatedError} = require('../errors/index')
const jwt = require('jsonwebtoken')

const auth = (req,res,next) => {
    //check Header
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication Invalid')
    }

    //get token by splitting
    const token = authHeader.split(' ')[1]

    try {
        //verify the token.payload consist of the id and name which you have passed while creating the token
        const payload = jwt.verify(token , process.env.JWT_SECRET)
        //make an user object in teh request for the jobs routes to have name and id
        req.user = { userId:payload.userId , name : payload.name }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid')
    }
}

module.exports = auth