const jwt=require("jsonwebtoken")
const userModel=require("../../models/userModel")

const auth=async (req,res,next)=>{
try{
    const token = req.headers.authorization;
    const verified = jwt.verify(token, process.env.SECRET_KEY)  // verify the token using the secret key returns payload if valid else throws error
    const user=await userModel.findById(verified.Id)
    if(user){
        req.user = user;
        next()
    }else{
        return res.status(401).json({message:"Unauthorized"})
    }
}catch(err){
    console.log("Error occured",err)
    res.status(401).json({message:"Unauthorized"})
}
}

module.exports=auth