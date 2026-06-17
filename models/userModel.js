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
    },role:{
        type:String,
        required:true,
        enum: ['employee', 'admin', 'super-admin'],
        default:"employee"
    }
})

const user=mongoose.model("User",userSchema);

module.exports=user