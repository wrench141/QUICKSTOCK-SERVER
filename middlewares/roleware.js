const Lab = require("../models/labs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const roleAuth = (roles) => {
    return async function(req, res, next){
        try {
            const eid = jwt.decode(req.headers.token, process.env.SALT);
            if(eid){
                const user = await User.findOne({employeeId: eid});
                if(user){
                    if(roles.includes(user.role)){
                        req.body.uid = user._id;
                        req.body.username = user.username
                        next()
                    }else{
                        res.status(403).json({data: "Unauthorized Access"})
                    }
                }else{
                    res.status(403).json({data: "User not found"})
                }
            }else{
                res.status(403).json({data: "Session expired"})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({data: "server error"})
        }
    }
}

module.exports = {roleAuth};