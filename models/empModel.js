const mongoose=require("mongoose")

const employeeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const emp= mongoose.model("Employee",employeeSchema)

module.exports=emp