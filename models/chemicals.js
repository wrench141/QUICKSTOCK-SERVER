const mongoose = require("mongoose")

const chemicalSchema = mongoose.Schema({
    name: {type: String, required: true},
    expiresAt: {type: Date, required: true}, 
    manufacturedDate: {type: Date, required: true}, 
    quantity: {type: String, required: true, default: ""}, 
    place: {type: String, required: true, default: "store"},
    chemicalCode: {type: String, required: true, unique: true},
    id: {type: String, required: true}
})

const Chemical = mongoose.model("chemicals", chemicalSchema);
module.exports = Chemical;