const mongoose=require("mongoose")

const adminSchema=new mongoose.Schema({
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
    adminPassword:{
        type:String,
        required:true,
    }
})

const admin=mongoose.model("Admin",adminSchema);

module.exports=admin