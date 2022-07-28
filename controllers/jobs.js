const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError , NotFoundError } = require('../errors/index.js')



const getAllJobs = async (req,res) => {
    const jobs = await Job.find({createdBy : req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json( {jobs , count:jobs.length} )
}

const getJob = async (req,res) => {
    const {user:{userId} , params:{id:jobId}} = req
    const job = await Job.findOne({_id:jobId , createdBy:userId })
    if(!job){
        throw new NotFoundError(`No job with jobID ${jobId}`)
    }
    res.status(StatusCodes.OK).json( {job} )
}

const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId            //so that each job has the userid by whom thre job is created
    console.log(req.user.userId)
    const job = await Job.create(req.body)  
    res.status(StatusCodes.CREATED).json( {job} )
}

const updateJob = async (req,res) => {
    const { user:{userId} , params:{id:jobId} , body:{company , position} } = req
    if(company =='' || position =='') {
        throw new BadRequestError('company or position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id:jobId , createdBy:userId} , req.body , {new:true,runValidators:true})
    //option new as truw will return the updated job in the job variable.run validators will simply run the mongoose validators
    if(!job){
        throw new NotFoundError(`No job with jobID ${jobId}`)
    }
    res.status(StatusCodes.OK).json( {job} )
}

const deleteJob = async (req,res) => {
    const {user:userId , params:{id:jobId}} = req
    const job = await Job.findByIdAndRemove({_id:jobId , createdBy:userId})
    if(!job){
        throw new NotFoundError(`No job with jobID ${jobId}`)
    }
    res.status(StatusCodes.OK).send(`deletd job with jobID ${jobId}`)  
}


module.exports = {getAllJobs , getJob , createJob , updateJob , deleteJob}