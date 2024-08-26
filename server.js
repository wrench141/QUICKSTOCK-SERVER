const express = require("express");
const cors = require("cors");
const initDB = require("./config/db.config");
const userRouter = require("./routes/user");
const storeRouter = require("./routes/store");
const chemicalRouter = require("./routes/chemicals");
const labsRouter = require("./routes/labs");


const PORT = process.env.PORT || 4000
const app = express();

app.use(express.json());
app.use(cors());

//api endpoints
//authorization
app.use("/api.v1/auth", userRouter);

//rooms
app.use("/api.v1/store", storeRouter);
app.use("/api.v1/labs", labsRouter);

//equipment and material
app.use("/api.v1/chemicals", chemicalRouter);


initDB.then(() => {
    app.listen(PORT, () => {
        console.log(`SERVER STARTED ${PORT}`);
    })
}).catch((err) => {
    console.log(err)
})