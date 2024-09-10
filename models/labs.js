const mongoose = require("mongoose");

const chemicalSchema = mongoose.Schema({
    chemicalId: {type: String, required: true},
    quantity: {type: Number, required: true}
})

const labSchema = mongoose.Schema({
    name: {type: String, required: true},
    roomNo:{type: String, required: true}, 
    chemicals: [chemicalSchema],
    inChargeId:{type: String, required: true},
});

const Lab = mongoose.model("labs", labSchema);
module.exports = Lab;