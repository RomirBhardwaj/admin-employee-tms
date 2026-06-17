const mongoose=require("mongoose")

const taskSchema=new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    dueDate:{
        type:Date,
        required:true
    },
    //employee tasks can also see details of admin
    assignedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        required:true,
        enum: ['pending', 'in-progress', 'completed'],
        default:"pending"
    }
},
{ timestamps: true })

const task=mongoose.model("Task",taskSchema)

module.exports=task
