const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {
        type:"String",
        unique: true,
        validate:{
            validator: (v) => {
                validator.isEmail(v)
            },
            message: props => `Invalid email ${prompt.value}`
        },
        required: true
    },
    employeeId:{type: String, required: true},
    password: {type: String, required: true, validate:{
        validator: (v) => {
            validator.isStrongPassword(v)
        },
        message: () => "Not a Strong password"
    }},
    role: {type: String, default: "user", required: true},
});

UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    const hash = await bcrypt.hash(this.password, 11);
    this.password = hash;
    next();
});

UserSchema.methods.genToken = function () {
    const token = jwt.sign(this.employeeId, process.env.SALT);
    console.log(token)
    return token;
}

const User = mongoose.model("User", UserSchema);
module.exports = User;