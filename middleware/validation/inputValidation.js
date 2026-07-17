const joi=require("joi");

const validation=(schema)=>{
    return (req,res,next)=>{
        const {error,value}=schema.validate(req.body,{abortEarly:false,stripUnknown:true})
        try{
            if(error){
                res.status(400).json({status:false,message:error.details.map((err)=>err.message)})
            }
            req.body=value
            next()
        }catch(err){
            next(err)
        }
    }
}

module.exports=validation