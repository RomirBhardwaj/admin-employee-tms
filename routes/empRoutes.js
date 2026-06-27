const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
const taskModel=require("../models/taskModel")
const auth=require("../middleware/auth/auth")
const checkRole=require("../middleware/auth/checkRole")
const bcrypt=require("bcrypt")


// employee routes

// signup route for employee (/emp/signup)
router.post("/signup",async (req,res)=>{
    const body=req.body
    if(!body.name || !body.email || !body.password || !body.parentId){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
    const adminExists = await userModel.findById(body.parentId)
    if (!adminExists || adminExists.role !== "admin") {
        return res.status(400).json({ message: "Valid admin parentId is required" })
    }
        const exists= await userModel.findOne({email:body.email})
        if(!exists){
            body.password=await bcrypt.hash(body.password,10)
            const userData=await userModel.create({ name: body.name, email: body.email, password: body.password , parentId: body.parentId })
            res.status(201).json({message:"employee created successfully",emp:{id:userData._id,name:userData.name,email:userData.email,parentId:userData.parentId}})
        }else{
            res.status(400).json({message:"employee already exists, please login/sign-in."})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// get all tasks details for employee (/emp/tasks)
router.get("/tasks",auth,checkRole(["employee"]),async(req,res)=>{
    try{
        const tasks=await taskModel.find({assignedTo:req.user._id}).populate("assignedBy","-password")
        if(tasks.length!=0){
            res.status(200).json({status:true,count:tasks.length,task:tasks})
        }else{
            res.status(404).json({status:true,count:0,message:"No tasks found"})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
}) 


// update status of assigned task (/emp/update)
router.put("/updatetask/:id",auth,checkRole(["employee"]),async(req,res)=>{
    const {status}=req.body
    const taskId=req.params.id
    try{

        const taskExists=await taskModel.findOne({_id:taskId,assignedTo:req.user._id})
        if(!taskExists){
            return res.status(404).json({status:false,message:"No task found with given task id"})
    }
    if (new Date() > new Date(taskExists.dueDate)) {
        return res.status(400).json({ message: "Due date has passed, cannot update status" })
  }
    
    if(status=="in-progress"||status=="completed"){  
            const taskData=await taskModel.findByIdAndUpdate(taskId,{
                status:status
            },{new:true})
            res.status(200).json({message:"Status updated successfully",task:taskData})
    }
    else{return res.status(401).json({message:"Please enter valid status"})
}
}
catch(err){
    console.log("Error occured",err)
    res.status(500).json({message:"Internal server error"})
}})


module.exports=router