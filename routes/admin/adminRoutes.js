const express=require("express")
const router=express.Router()
const adminModel=require("../../models/adminModel")
const taskModel=require("../../models/taskModel")
const auth=require("../../middleware/auth/auth")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

// admin sign up route (/admin/signup)
router.post("/signup",async (req,res)=>{
    const body=req.body
    if(!body.name || !body.email || !body.password || !body.adminPassword){
        return res.status(400).json({message:"All fields are required"})
    }
    if(body.adminPassword !== process.env.ADMIN_PASSWORD){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        // since email is unique 
        const exists= await adminModel.findOne({email:body.email})
        if(!exists){
            body.password=await bcrypt.hash(body.password,10)
            const adminData=await adminModel.create(body)
            res.status(200).json({message:"Admin created successfully",admin:{id:adminData._id,name:adminData.name,email:adminData.email}})
        }else{
            res.status(400).json({message:"Admin already exists, please login/sign-in."})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})

// admin login route (/admin/login)
router.post("/login",async(req,res)=>{
    const body=req.body
    if(!body.email || !body.password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const adminData=await adminModel.findOne({email:body.email})
        if(adminData){
            const verifyPassword=await bcrypt.compare(body.password,adminData.password)
            if(verifyPassword){
                
                const token=jwt.sign({role:"admin",Id:adminData._id,email:adminData.email,},process.env.SECRET_KEY,{expiresIn: "7d"})
                res.status(200).json({message:"Logged in successfully",admin:{id:adminData._id,name:adminData.name,email:adminData.email},token:token})
            }else{
                res.status(401).json({message:"Entered wrong password"})
            }
        }else{
            res.status(401).json({message:"Admin not found"})
        }   
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// add/create task route (/admin/createtask)
router.post("/createtask",auth ,async(req,res)=>{
    const body=req.body
    if(!body.task || !body.dueDate || !body.assignedTo ){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const taskData=await taskModel.create({
            task:body.task,
            description:body.description,
            dueDate:body.dueDate,
            // assigned by is filled in roue only 
            assignedBy:req.admin._id,
            assignedTo:body.assignedTo
        })
        res.status(200).json({message:"Task created successfully",task:taskData})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// update task (/admin/updatetask/:id)
router.put("/updatetask/:id",auth,async(req,res)=>{
    const body=req.body
    const taskId=req.params.id
    if(!body.task || !body.dueDate || !body.assignedTo ){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const taskData=await taskModel.findByIdAndUpdate(taskId,{
            task:body.task,
            description:body.description,
            dueDate:body.dueDate,
            assignedTo:body.assignedTo
        },{new:true})
        res.status(200).json({message:"Task updated successfully",task:taskData})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// get all tasks(/admin/tasks)
router.get("/tasks",auth,async(req,res)=>{
    const tasks=await taskModel.find({assignedBy:req.admin._id}).populate("assignedTo")
    if(tasks.length!=0){
            res.status(200).json({status:true,count:tasks.length,task:tasks})
    }else{
        res.status(404).json({status:true,count:0,message:"No tasks found"})
    }
})


//get all admins (/admin/admins)
router.get("/admins",auth,async(req,res)=>{
    const admins=await adminModel.find()
    res.status(200).json({status:true,count:admins.length,admins:admins})
})



//get all employees (/admin/employees)
router.get("/employees",auth,async(req,res)=>{
    const employees=await empModel.find({adminId:req.admin._id})
    res.status(200).json({status:true,count:employees.length,employees:employees})
})


// delete task (/admin/delete/:id)
router.delete("/deletetask/:id",auth,async (req,res)=>{
    const id=req.params.id;
    const deletedTask=await taskModel.findByIdAndDelete(id) 
    if(!deletedTask){
        res.status(404).json({status:false,message:"task not found"})
    }else{
        res.status(200).json({status:true,message:"Task deleted successfully.",deletedTask:deletedTask})
    }
})


module.exports=router