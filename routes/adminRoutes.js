const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
const taskModel=require("../models/taskModel")
const auth=require("../middleware/auth/auth")
const checkRole=require("../middleware/auth/checkRole")
const bcrypt=require("bcrypt")
const apiError=require("../middleware/error/apiError")

//route to create a admin (/admin/createadmin) only super admin can create admin
router.post("/createadmin",auth,checkRole(["super-admin"]),async(req,res,next)=>{
    const admin_data=req.body
    try{
    if(!admin_data.name || !admin_data.email || !admin_data.password || !admin_data.parentId){
        throw new apiError("All fields are required",400)
    }
        const exists= await userModel.findOne({email:admin_data.email})
        if(!exists){
            const parent=await userModel.findById(admin_data.parentId)
            if(!parent || parent.role!=="super-admin"){
                throw new apiError("Invalid parentId, only super-admin can create admin",400)
            }
            admin_data.password=await bcrypt.hash(admin_data.password,10)
            const admin=await userModel.create({name:admin_data.name,email:admin_data.email,password:admin_data.password,role:"admin",parentId:admin_data.parentId})
            res.status(200).json({message:"Admin created successfully",admin:{id:admin._id,name:admin.name,email:admin.email,parentId:admin.parentId}})
        }else{
            throw new apiError("Admin already exists, please login/sign-in.",400)
        }
    }catch(err){
        next(err)
    }
})



// create task route (/admin/createtask)
router.post("/createtask",auth ,checkRole(["admin"]),async(req,res,next)=>{
    const body=req.body
    try{
    if(!body.task || !body.dueDate || !body.assignedTo ){
        throw new apiError("All fields are required",400)
    }
        const assignedToUser=await userModel.findById(body.assignedTo)
        if(!assignedToUser || assignedToUser.role!=="employee"){
            throw new apiError("Invalid assignedTo, only an employee can be assigned task",400)
        }
        if(assignedToUser.parentId.toString()!==req.user._id.toString()){
            throw new apiError("You can only assign task to your employees",400)
        }
        if(new Date(body.dueDate)<new Date()){
            throw new apiError("Due date cannot be in the past",400)
        }
        const taskData=await taskModel.create({
            task:body.task,
            description:body.description,
            dueDate:body.dueDate,
            assignedBy:req.user._id,
            assignedTo:body.assignedTo
        })
        res.status(200).json({message:"Task created successfully",task:taskData})
    }catch(err){
        next(err)
    }
})


// update task (/admin/updatetask/:id)
// for updating task only admin who created the task can update the task
router.put("/updatetask/:id",auth,checkRole(["admin"]),async(req,res,next)=>{
    const body=req.body
    const taskId=req.params.id
    try{
    if(!body.task || !body.dueDate || !body.assignedTo || !taskId){
        throw new apiError("All fields are required",400)
    }
        const taskData=await taskModel.findOneAndUpdate({_id:taskId,assignedBy:req.user._id},{
            task:body.task,
            description:body.description,
            dueDate:body.dueDate,
            assignedBy:req.user._id,
            assignedTo:body.assignedTo
        },{new:true})
        res.status(200).json({message:"Task updated successfully",task:taskData})
    }catch(err){
        next(err)
    }
})


// delete task (/admin/deletetask/:id)
router.delete("/deletetask/:id",auth,checkRole(["admin"]),async (req,res,next)=>{
    const id=req.params.id;
    try{
        const deletedTask=await taskModel.findByIdAndDelete(id) 
        if(!deletedTask){
            throw new apiError("Task not found",404)
        }else{
            res.status(200).json({status:true,message:"Task deleted successfully.",deletedTask:deletedTask})
        }
    }catch(err){
        next(err)
    }
})


// get all assigned tasks details (/admin/tasks)
router.get("/tasks",auth,checkRole(["admin"]),async(req,res,next)=>{
    try{
        const tasks=await taskModel.find({assignedBy:req.user._id}).populate("assignedTo","-password")   
        if(tasks.length!=0){
            res.status(200).json({status:true,count:tasks.length,task:tasks})
        }else{
            res.status(404).json({status:true,count:0,message:"No tasks found"})
        }
    }catch(err){
        next(err)
    }
})


//get all admins (/admin/admins)
router.get("/admins",auth,checkRole(["super-admin","admin"]),async(req,res,next)=>{
    try{
        const admins=await userModel.find({role:"admin"}).select("-password")   //select("-password") is used to exclude password field from the result
        res.status(200).json({status:true,count:admins.length,admins:admins})
    }catch(err){
        next(err)
    }
})


//get all employees (/admin/employees)
router.get("/employees",auth,checkRole(["super-admin","admin"]),async(req,res,next)=>{
    try{
        const employees=await userModel.find({role:"employee"}).select("-password")   //select("-password") is used to exclude password field from the result
        res.status(200).json({status:true,count:employees.length,employees:employees})
    }catch(err){
        next(err)
    }
})


module.exports=router