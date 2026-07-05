// authoriztion middleware to check if the user has the required role(s) to access a route
const apiError=require("../../apiError")
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try{

            const user= req.user; 
            if (!user) {
                throw new apiError("Unauthorized", 401);
            }
            if(!allowedRoles.includes(user.role)) {
                throw new apiError("Forbidden", 403);
            }
            next();
        }catch(err){
            next(err)
        }
    }

}

module.exports = checkRole