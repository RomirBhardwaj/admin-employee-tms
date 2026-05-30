const express=require("express")
const router=express.Router()
const adminModel=require("../../models/adminModel")
const empModel=require("../../models/empModel")
const taskModel=require("../../models/taskModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const auth=require("../../middleware/auth/auth")

// employee sign up route (/emp/signup)
router.post("/signup",async (req,res)=>{
    const body=req.body
    if(!body.name || !body.email || !body.password || !body.adminId){
        return res.status(400).json({message:"All fields are required"})
    }
    const adminExists=adminModel.findById(body.adminId)
    if(!adminExists){
        return res.status(401).json({message:"Admin with the provided adminId does not exist"})
    }

    try{
        const exists= await empModel.findOne({email:body.email})
        if(!exists){
            body.password=await bcrypt.hash(body.password,10)
            const empData=await empModel.create(body)
            res.status(200).json({message:"employee created successfully",emp:{id:empData._id,name:empData.name,email:empData.email}})
        }else{
            res.status(400).json({message:"employee already exists, please login/sign-in."})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})

// emp login route (/emp/login)
router.post("/login",async(req,res)=>{
    const body=req.body
    if(!body.email || !body.password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const empData=await empModel.findOne({email:body.email})
        if(empData){
            const verifyPassword=await bcrypt.compare(body.password,empData.password)
            if(verifyPassword){
                const token=jwt.sign({role:"employee",Id:empData._id,email:empData.email},process.env.SECRET_KEY,{expiresIn: "7d"})
                res.status(200).json({message:"Logged in successfully",emp:{id:empData._id,name:empData.name,email:empData.email},token:token})
            }else{
                res.status(401).json({message:"Entered wrong password"})
            }   
        }else{
            res.status(401).json({message:"employee not found"})
        }   
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// get their details (/emp/details)
router.get("/details",auth,async(req,res)=>{
    res.status(200).json({status:true,emp:req.emp})
})


//update their details (/emp/update)
router.put("/update",auth,async(req,res)=>{
    const body=req.body
        if(!body.name || !body.email || !body.password || !body.adminId){   
        return res.status(400).json({message:"All fields are required"})
    }   
    if(body.adminId){
        const adminExists=await adminModel.findOne({_id:body.adminId}) 
        if(!adminExists){
            return res.status(404).json({message:"Admin with the provided adminId does not exist"})
        }else{
            const empData=await empModel.findByIdAndUpdate(req.emp._id,{
                name:body.name,
                email:body.email,
                password:await bcrypt.hash(body.password,10),
                adminId:body.adminId
            },{new:true})
            res.status(200).json({message:"employee details updated successfully",emp:{id:empData._id,name:empData.name,email:empData.email}})
        }
    } }
)


// task details for employee (/emp/tasks)
router.get("/tasks",auth,async(req,res)=>{
    const tasks=await taskModel.find({assignedTo:req.emp._id}).populate("assignedBy")
    if(tasks.length!=0){
            res.status(200).json({status:true,count:tasks.length,task:tasks})
    }else{
        res.status(404).json({status:true,count:0,message:"No tasks found"})
    }
}) 


// update status of assigned task (/emp/update)
router.put("/updatetask/:id",auth,async(req,res)=>{
    const {status}=req.body
    const taskId=req.params.id

    const taskExists=await taskModel.findOne({_id:taskId,assignedTo:req.emp._id})
    if(!taskExists){
        return res.status(404).json({status:false,message:"No task found with given task id"})
    }
    if (new Date() > new Date(taskExists.dueDate)) {
        return res.status(400).json({ message: "Due date has passed, cannot update status" })
  }
    
    if(status=="in-progress"||status=="completed"){
        try{
            const taskData=await taskModel.findByIdAndUpdate(taskId,{
                status:status
            },{new:true})
            res.status(200).json({message:"Status updated successfully",task:taskData})
        }catch(err){
            console.log("Error occured",err)
            res.status(500).json({message:"Internal server error"})
        }
    }
    else{return res.status(401).json({message:"Please enter valid status"})
}})


module.exports=router