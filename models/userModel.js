const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        required:true
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        // explicitly setting null:true to avoid mongoose validation error when creating super-admin user
        // we cant set required:true because super-admin user will not have any parentId
        null:true
    },
    role:{
        type:String,
        required:true,
        enum: ['employee', 'admin', 'super-admin'],
        default:"employee"
    }
})

const user=mongoose.model("User",userSchema);

module.exports=user