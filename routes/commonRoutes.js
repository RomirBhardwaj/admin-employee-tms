const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
const taskModel=require("../models/taskModel")
const auth=require("../middleware/auth/auth")
const checkRole=require("../middleware/auth/checkRole")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


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
                res.status(200).json({message:"Logged in successfully",user:{id:userData._id,name:userData.name,email:userData.email,role:userData.role,parentId:userData.parentId},token:token})
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
    // user cant update role, email and parentId, so we are not checking for those fields
        if(!body.name|| !body.password ){   
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        const userData=await userModel.findByIdAndUpdate(req.user._id,{
            name:body.name,
            password:await bcrypt.hash(body.password,10),
        },{new:true})
        res.status(200).json({message:"user details updated successfully",user:{id:userData._id,name:userData.name,email:userData.email,role:userData.role,parentId:userData.parentId}})
    }catch(err){
        console.log("Error occured",err)
        res.status(500).json({message:"Internal server error"})
    } 
}
)


module.exports=router