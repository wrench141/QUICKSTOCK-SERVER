const { createLab, assignIncharge, getLabs, getLab, stockUsage, getExperiments, getExperiment } = require("../controllers/labs");
const { roleAuth } = require("../middlewares/roleware");
const labsRouter = require("express").Router();

labsRouter.get("/", roleAuth(["admin", "lab incharge", "store manager"]), getLabs);
labsRouter.get("/:id", roleAuth(["admin", "lab incharge", "store manager"]), getLab);

//experiments
labsRouter.get("/experiments/:id", roleAuth(["admin", "lab incharge"]), getExperiments)
labsRouter.get("/experiment/:id", roleAuth(["admin", "lab incharge"]), getExperiment)

labsRouter.post("/create", roleAuth(["admin", "lab incharge", "store manager"]), createLab);
labsRouter.post("/assignIncharge", roleAuth(["admin", "lab incharge", "store manager"]), assignIncharge);
labsRouter.post("/changeStock/:id", roleAuth(["admin", "lab incharge"]), stockUsage);

module.exports = labsRouter