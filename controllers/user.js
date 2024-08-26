const User = require("../models/user");
const bcrypt = require("bcryptjs")

const register = async(req, res) => {
    try {
        const {eid, email, password} = req.body;
        const extUser = await User.findOne({employeeId: eid});
        if(extUser){
            res.status(400).json({data: "User already exists"})
        }else{
            const newUser = new User({
                employeeId: eid, email, password
            });
            await newUser.save();
            res.status(200).json({data: "account created"})
        }
        console.log(eid, password)
    } catch (error) {
        res.status(500).json({data: "server error"})
        console.log(error)
    }
};

const login = async(req, res) => {
    try {
        const {eid, password} = req.body;
        const extUser = await User.findOne({employeeId: eid});
        if(extUser){
            console.log(extUser)
            const status = bcrypt.compare(password, extUser.password);
            if(status){
                const token = extUser.genToken();
                res.status(200).json({data: "login success", token})
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
    res.status(200).json({data: await User.find()})}

module.exports = {register, login, getAllUsers}