const { getAllChemicals, recordChemical, updateChemical, removeChemical, preRecordData, removeChemicals } = require("../controllers/chemicals");
const { roleAuth } = require("../middlewares/roleware");

const chemicalRouter = require("express").Router();

const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
const uploads = multer({ storage: storage });

chemicalRouter.get("/", roleAuth(["admin", "store manager", "lab incharge"]), getAllChemicals);
chemicalRouter.post("/preRecordData", roleAuth(["admin", "store manager"]), uploads.single("file"), preRecordData);
chemicalRouter.post("/create", roleAuth(["admin", "store manager"]), recordChemical);
chemicalRouter.patch("/update/:code", roleAuth(["admin", "store manager"]), updateChemical);
chemicalRouter.delete("/remove/:code", roleAuth(["admin", "store manager"]), removeChemical);
chemicalRouter.delete("/removeAll", roleAuth(["admin", "store manager"]), removeChemicals);

module.exports = chemicalRouter;