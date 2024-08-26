const { createLab, assignIncharge } = require("../controllers/labs");
const { roleAuth } = require("../middlewares/roleware");
const labsRouter = require("express").Router();

labsRouter.post("/create", roleAuth(["admin", "lab incharge"]), createLab);
labsRouter.post("/assignIncharge", roleAuth(["admin", "lab incharge"]), assignIncharge);

module.exports = labsRouter