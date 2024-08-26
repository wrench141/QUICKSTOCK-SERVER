const { createStore, getStore, updateStock, removeStore } = require("../controllers/store");
const { roleAuth } = require("../middlewares/roleware");
const storeRouter = require("express").Router();

storeRouter.post("/createStore", roleAuth(["admin"]), createStore);
storeRouter.get("/", roleAuth(["admin", "store manager"]), getStore), 
storeRouter.patch("/updateStock", roleAuth(["admin", "store manager"]), updateStock);
storeRouter.delete("/removeStore/:storeId", roleAuth(["admin", "store manager"]), removeStore)

module.exports = storeRouter;