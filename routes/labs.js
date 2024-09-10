const { createLab, assignIncharge, getLabs } = require("../controllers/labs");
const { roleAuth } = require("../middlewares/roleware");
const labsRouter = require("express").Router();

labsRouter.get("/", roleAuth(["admin", "lab incharge", "store manager"]), getLabs);
labsRouter.post("/create", roleAuth(["admin", "lab incharge", "store manager"]), createLab);
labsRouter.post("/assignIncharge", roleAuth(["admin", "lab incharge", "store manager"]), assignIncharge);

module.exports = labsRouter