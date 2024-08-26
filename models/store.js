const mongoose = require("mongoose");

const stockSchema = mongoose.Schema({
    stockType: {type:String, required: true},
    stockid: {type: String, required: true}
})

const StoreSchema = mongoose.Schema({
    storeId: {type: String, required: true},
    storeIncharge: {type: String, required: true},
    stock: [stockSchema]
})


const Store = mongoose.model("Store", StoreSchema);
module.exports = Store;