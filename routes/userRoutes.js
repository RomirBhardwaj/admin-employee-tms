const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
const taskModel=require("../models/taskModel")
const auth=require("../middleware/auth/auth")
const checkRole=require("../middleware/auth/checkRole")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


//route to create a admin (/admin/createadmin) only super admin can create admin
router.post("/admin/createadmin",auth,checkRole(["super-admin"]),async(req,res)=>{
    const admin_data=req.body
    if(!admin_data.name || !admin_data.email || !admin_data.password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const exists= await userModel.findOne({email:admin_data.email})
        if(!exists){
            admin_data.password=await bcrypt.hash(admin_data.password,10)
            const admin=await userModel.create({name:admin_data.name,email:admin_data.email,password:admin_data.password,role:"admin"})
            res.status(200).json({message:"Admin created successfully",admin:{id:admin._id,name:admin.name,email:admin.email}})
        }else{
            res.status(400).json({message:"Admin already exists, please login/sign-in."})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})



// login route (super admin/admin/employee)  (/login)
router.post("/login",async(req,res)=>{
    const body=req.body
    if(!body.email || !body.password){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const userData=await userModel.findOne({email:body.email})
        if(userData){
            const verifyPassword=await bcrypt.compare(body.password,userData.password)
            if(verifyPassword){
                const token=jwt.sign({role:userData.role,Id:userData._id,email:userData.email,},process.env.SECRET_KEY,{expiresIn: "7d"})
                res.status(200).json({message:"Logged in successfully",user:{id:userData._id,name:userData.name,email:userData.email},token:token})
            }else{
                res.status(401).json({message:"Entered wrong password"})
            }
        }else{
            res.status(401).json({message:"User not found"})
        }   
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// get user details (/details)
router.get("/details",auth,async(req,res)=>{
    try{
        res.status(200).json({status:true,user:req.user})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


//update user details (/update)
router.put("/update",auth,checkRole(["admin","employee"]),async(req,res)=>{
    const body=req.body
        if(!body.name || !body.email || !body.password ){   
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const userData=await userModel.findByIdAndUpdate(req.user._id,{
            name:body.name,
            email:body.email,
            password:await bcrypt.hash(body.password,10),
        },{new:true})
        res.status(200).json({message:"user details updated successfully",user:{id:userData._id,name:userData.name,email:userData.email}})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    } 
}
)


// create task route (/admin/createtask)
router.post("/admin/createtask",auth ,checkRole(["admin"]),async(req,res)=>{
    const body=req.body
    if(!body.task || !body.dueDate || !body.assignedTo ){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const assignedToUser=await userModel.findById(body.assignedTo)
        
        const taskData=await taskModel.create({
            task:body.task,
            description:body.description,
            dueDate:body.dueDate,
            // assigned by is filled in route only 
            assignedBy:req.user._id,
            // for now we are not checking if the assignedTo is valid employee or not, we can add that check later
            assignedTo:body.assignedTo
        })
        res.status(200).json({message:"Task created successfully",task:taskData})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// update task (/admin/updatetask/:id)
// for updating task only admin who created the task can update the task
router.put("/admin/updatetask/:id",auth,checkRole(["admin"]),async(req,res)=>{
    const body=req.body
    const taskId=req.params.id
    if(!body.task || !body.dueDate || !body.assignedTo ){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const taskData=await taskModel.findOneAndUpdate({_id:taskId,assignedBy:req.user._id},{
            task:body.task,
            description:body.description,
            dueDate:body.dueDate,
            assignedBy:req.user._id,
            assignedTo:body.assignedTo
        },{new:true})
        res.status(200).json({message:"Task updated successfully",task:taskData})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// delete task (/admin/deletetask/:id)
router.delete("/admin/deletetask/:id",auth,checkRole(["admin"]),async (req,res)=>{
    const id=req.params.id;
    try{
        const deletedTask=await taskModel.findByIdAndDelete(id) 
        if(!deletedTask){
            res.status(404).json({status:false,message:"task not found"})
        }else{
            res.status(200).json({status:true,message:"Task deleted successfully.",deletedTask:deletedTask})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// get all assigned tasks details (/admin/tasks)
router.get("/admin/tasks",auth,checkRole(["admin"]),async(req,res)=>{
    try{
        const tasks=await taskModel.find({assignedBy:req.user._id}).populate("assignedTo","-password")   
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


//get all admins (/admins)
router.get("/admins",auth,checkRole(["super-admin","admin"]),async(req,res)=>{
    try{
        const admins=await userModel.find({role:"admin"}).select("-password")   //select("-password") is used to exclude password field from the result
        res.status(200).json({status:true,count:admins.length,admins:admins})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})



//get all employees (/employees)
router.get("/employees",auth,checkRole(["super-admin","admin"]),async(req,res)=>{
    try{
        const employees=await userModel.find({role:"employee"}).select("-password")   //select("-password") is used to exclude password field from the result
        res.status(200).json({status:true,count:employees.length,employees:employees})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})



// employee routes

// signup route for employee (/emp/signup)
router.post("/emp/signup",async (req,res)=>{
    const body=req.body
    if(!body.name || !body.email || !body.password || !body.adminId){
        return res.status(400).json({message:"All fields are required"})
    }
    try{
    const adminExists=await userModel.findById(body.adminId)
    if(!adminExists){
        return res.status(401).json({message:"Admin with the provided adminId does not exist"})
    }
        const exists= await userModel.findOne({email:body.email})
        if(!exists){
            body.password=await bcrypt.hash(body.password,10)
            const userData=await userModel.create({ name: body.name, email: body.email, password: body.password , adminId: body.adminId })
            res.status(200).json({message:"employee created successfully",emp:{id:userData._id,name:userData.name,email:userData.email}})
        }else{
            res.status(400).json({message:"employee already exists, please login/sign-in."})
        }
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    }
})


// get all tasks details for employee (/emp/tasks)
router.get("/emp/tasks",auth,checkRole(["employee"]),async(req,res)=>{
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
router.put("/emp/updatetask/:id",auth,checkRole(["employee"]),async(req,res)=>{
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