const express=require("express")
const router=express.Router()
const userModel=require("../models/userModel")
const taskModel=require("../models/taskModel")
const auth=require("../middleware/auth/auth")
const checkRole=require("../middleware/auth/checkRole")
const bcrypt=require("bcrypt")
const apiError=require("../middleware/error/apiError")
const jwt=require("jsonwebtoken")

// login route (super admin/admin/employee)  (/login)
router.post("/login",async(req,res,next)=>{
    const body=req.body
    try{
    if(!body.email || !body.password){
        throw new apiError("All fields are required",400)
    }
        const userData=await userModel.findOne({email:body.email})
        if(userData){
            const verifyPassword=await bcrypt.compare(body.password,userData.password)
            if(verifyPassword){
                const token=jwt.sign({role:userData.role,Id:userData._id,email:userData.email,},process.env.SECRET_KEY,{expiresIn: "7d"})
                res.status(200).json({message:"Logged in successfully",user:{id:userData._id,name:userData.name,email:userData.email,role:userData.role,parentId:userData.parentId},token:token})
            }else{
                throw new apiError("Entered wrong password",401)
            }
        }else{
            throw new apiError("User not found",401)
        }   
    }catch(err){
        next(err)
    }
})


// get user details (/details)
router.get("/details",auth,async(req,res,next)=>{
    try{
        res.status(200).json({status:true,user:req.user})
    }catch(err){
        next(err)
    }
})


//update user details (/update)
router.put("/update",auth,checkRole(["admin","employee"]),async(req,res,next)=>{
    const body=req.body
    // user cant update role, email and parentId, so we are not checking for those fields
    try{
        if(!body.name|| !body.password ){   
        throw new apiError("All fields are required",400)
    }
        const userData=await userModel.findByIdAndUpdate(req.user._id,{
            name:body.name,
            password:await bcrypt.hash(body.password,10),
        },{new:true})
        res.status(200).json({message:"user details updated successfully",user:{id:userData._id,name:userData.name,email:userData.email,role:userData.role,parentId:userData.parentId}})
    }catch(err){
        next(err)
    } 
}
)


module.exports=router