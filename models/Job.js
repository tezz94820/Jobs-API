const mongoose = require('mongoose')


const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true , 'please provide a company name'] ,
        maxLength : 50
    } , 
    position : {
        type:String ,
        required:[true , 'please provide a position '] ,
        maxLength : 100
    } ,
    status : {
        type:String , 
        enum:['interview' , 'declined' , 'pending'] ,       //in enum the user can enter only this values
        default : 'pending'
    } ,
    createdBy : {
        //by doing this type, each there will be a unique id for each user which is given to the user's job
        type: mongoose.Types.ObjectId ,
        //ref is used to join User model to Job model.
        ref: 'User' ,
        required:[true , 'please provide user']
        //here so all the jobs craeted by a particular user have same ObjectId
    }
} , {timestamps:true} )

module.exports = mongoose.model('Job' , JobSchema)