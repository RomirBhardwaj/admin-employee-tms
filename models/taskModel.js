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
    assignedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Admin"
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Employee"
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
