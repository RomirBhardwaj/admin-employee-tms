const errorHandler=(err,req,res,next)=>{
    let statusCode= err.statusCode || 500;
    let message=err.message || "ErRor Occured";

    if(statusCode===1100){
        return res.status(400).json({
            status:"false",
            message:"Duplicate entry found",
            timestamp:new Date(),
            path:req.path
        })
    }
    else if(statusCode===400){
        return res.status(400).json({
            status:"false",
            message:message,
            timestamp:new Date(),
            path:req.path
        })
    }
    else{
        return res.status(statusCode).json({
            status:false,
            message:message,
            timestamp:new Date(),
            path:req.path
        })
    }
}

module.exports=errorHandler