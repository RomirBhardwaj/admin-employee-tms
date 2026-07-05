const jwt=require("jsonwebtoken")
const userModel=require("../../models/userModel")
const apiError=require("../../apiError")

const auth=async (req,res,next)=>{
try{
    const token = req.headers.authorization;
    if(!token){
        throw new apiError("No token provided", 401)
    }
    const verified = jwt.verify(token, process.env.SECRET_KEY)  // verify the token using the secret key returns payload if valid else throws error
    const user=await userModel.findById(verified.Id)
    if(user){
        req.user = {_id:user._id,name:user.name,email:user.email,role:user.role,parentId:user.parentId}  // adding user details to req.user object for further use in routes;
        next()
    }else{
        throw new apiError("User not found",404)
    }
}catch(err){
    next(err)
}
}

module.exports=auth