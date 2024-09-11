const Lab = require("../models/labs");
const User = require("../models/user");
const bcrypt = require("bcryptjs")

const register = async(req, res) => {
    try {
        const {eid, username, email, password} = req.body;
        const extUser = await User.findOne({employeeId: eid});
        if(extUser){
            res.status(400).json({data: "User already exists"})
        }else{
            const newUser = new User({
                employeeId: eid, username, email, password
            });
            await newUser.save();
            const token = newUser.genToken()
            res.status(200).json({data: "account created", token})
        }
        console.log(eid, password)
    } catch (error) {
        res.status(500).json({data: "server error"})
        console.log(error)
    }
};

const login = async(req, res) => {
    try {
        const {username, password} = req.body;
        const extUser = await User.findOne({username});
        if(extUser){
            console.log(extUser)
            const status = bcrypt.compare(password, extUser.password);
            if(status){
                console.log(extUser)
                const token = extUser.genToken();
                if(extUser.role == "admin" || extUser.role == "store manager"){
                    res.status(200).json({data: "login success", token, redirect: "/store"})
                }else if(extUser.role == "lab incharge"){
                    const lab = await Lab.findOne({inChargeId: extUser.employeeId})
                    res.status(200).json({data: "login success", token, redirect: `/lab/${lab._id}`})
                }else{
                    res.status(200).json({data: "login success", token, redirect: "/forbidden"})
                }
            }else{
                res.status(403).json({data: "invalid credintials"})
            }
        }else{
            res.status(404).json({data: "user not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password -role');
        res.status(200).json({data: users})
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

module.exports = {register, login, getAllUsers}