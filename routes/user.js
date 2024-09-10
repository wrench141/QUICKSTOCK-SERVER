const userRouter = require("express").Router();
const { register, login, getAllUsers } = require("../controllers/user");
const { roleAuth } = require("../middlewares/roleware");

userRouter.post("/register", register);
userRouter.post("/login", login)

//test endpoints
userRouter.get("/users", roleAuth(["admin", "store manager"]), getAllUsers)

module.exports = userRouter