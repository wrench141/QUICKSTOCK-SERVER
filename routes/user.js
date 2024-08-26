const userRouter = require("express").Router();
const { register, login, getAllUsers } = require("../controllers/user");

userRouter.post("/register", register);
userRouter.post("/login", login)

//test endpoints
userRouter.get("/users", getAllUsers)

module.exports = userRouter