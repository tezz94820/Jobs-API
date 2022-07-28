const { StatusCodes, NON_AUTHORITATIVE_INFORMATION } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {


  let customError = {
    //set defaulkt status codfe and msg
    statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR ,
    msg:err.message || 'something went wrong try again later'
  }

  
  //mongoose errors
  //for Dublicate email the error is defined
  if(err.code && err.code==11000){
    customError.msg = `Dublicate value entered for ${Object.keys(err.keyValue)} field , please choose another value for email`
    customError.statusCode = 400
  }

  //error for ifwhile login any of the password or email is not provided
  if(err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map(item => item.meessage).join(',')
    customError.statusCode = 401
  }

  //CastError
  if(err.name === 'CastError'){
    customError.msg = `No item found with id : ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({msg:customError.msg})
}

module.exports = errorHandlerMiddleware
