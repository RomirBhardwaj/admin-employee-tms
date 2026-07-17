const joi=require("joi");

const inputUserSchema = joi.object({
    name:joi.string().required().min(2).max(5).trim(),
    email:joi.string().required().email(),
    password:joi.string().required().min(8).max(100),
    parentId:joi.string().allow(null)
    
});
module.exports=inputUserSchema;