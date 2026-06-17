// authoriztion middleware to check if the user has the required role(s) to access a route

const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const user= req.user; 
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if(!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    }

}

module.exports = checkRole