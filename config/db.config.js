const mongoose = require("mongoose");
require("dotenv").config();

let initDB = new Promise((resolve, reject) => {
    mongoose.connect(process.env.DB).then(() => {
        resolve("DB CONNECTED")
    }).catch((err) => {
        console.log(err)
        reject("DB ERROR")
    })
})

module.exports = initDB;