const express=require("express")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const adminModel=require("../../models/adminModel")
const empModel=require("../../models/empModel")

const auth=async (req,res,next)=>{
try{

    const token = req.headers.authorization;
    const verified = jwt.verify(token, process.env.SECRET_KEY)
    if(verified.role=="admin"){
        const admin=await adminModel.findById(verified.Id)
        if(admin){
            req.admin = admin;
            next()
        }else{
            return res.status(401).json({message:"Unauthorized "})
        }
    }else if(verified.role==="employee"){
           const emp=await empModel.findById(verified.Id)
        if(emp){
            req.emp = emp;
            next()
        }else{
            return res.status(401).json({message:"Unauthorized"})
        }
    }else{
        return res.status(401).json({message:"Unauthorized"})
    }
}catch(err){
    console.log("Error occured",err)
    res.status(401).json({message:"Unauthorized"})}
}

module.exports=auth