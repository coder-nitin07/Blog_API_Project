const authorizedRoles = async (req, res, next)=>{
    const userRole = req.user.role;
    
    console.log("req.user.role is", req.user.role);
    if(userRole === 'Admin' || userRole === 'Author'){
        return next();
    }
    
    return res.status(403).json({ message: 'You are not authorized for this ROle' });
};

module.exports = authorizedRoles;