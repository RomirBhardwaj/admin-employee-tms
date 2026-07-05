const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
const taskModel=require("../models/taskModel")
const auth=require("../middleware/auth/auth")
const checkRole=require("../middleware/auth/checkRole")
const bcrypt=require("bcrypt")
const apiError=require("../apiError")

// employee routes

// signup route for employee (/emp/signup)
router.post("/signup",async (req,res,next)=>{
    const body=req.body
    try{
    if(!body.name || !body.email || !body.password || !body.parentId){
        throw new apiError("All fields are required",400)
    }
    const adminExists = await userModel.findById(body.parentId)
    if (!adminExists || adminExists.role !== "admin") {
        throw new apiError("Valid admin parentId is required",404)
    }
        const exists= await userModel.findOne({email:body.email})
        if(!exists){
            body.password=await bcrypt.hash(body.password,10)
            const userData=await userModel.create({ name: body.name, email: body.email, password: body.password , parentId: body.parentId })
            res.status(201).json({message:"employee created successfully",emp:{id:userData._id,name:userData.name,email:userData.email,parentId:userData.parentId}})
        }else{
            throw new apiError("employee already exists, please login/sign-in.",400)
        }
    }catch(err){
        next(err)
    }
})


// get all tasks details for employee (/emp/tasks)
router.get("/tasks",auth,checkRole(["employee"]),async(req,res,next)=>{
    try{
        const tasks=await taskModel.find({assignedTo:req.user._id}).populate("assignedBy","-password")
        if(tasks.length!=0){
            res.status(200).json({status:true,count:tasks.length,task:tasks})
        }else{
            throw new apiError("No tasks found for this employee",404)
        }
    }catch(err){
        next(err)
    }
}) 


// update status of assigned task (/emp/update)
router.put("/updatetask/:id",auth,checkRole(["employee"]),async(req,res,next)=>{
    const {status}=req.body
    const taskId=req.params.id
    try{
        const taskExists=await taskModel.findOne({_id:taskId,assignedTo:req.user._id})
        if(!taskExists){
            throw new apiError("No task found with given task id",404)
        }
    if (new Date() > new Date(taskExists.dueDate)) {
        throw new apiError("Due date has passed, cannot update status",400)
  }
    
    if(status=="in-progress"||status=="completed"){  
            const taskData=await taskModel.findByIdAndUpdate(taskId,{
                status:status
            },{new:true})
            res.status(200).json({message:"Status updated successfully",task:taskData})
    }
    else{
        throw new apiError("Please enter valid status",401)
}
}
catch(err){
    next(err)
}})


module.exports=router