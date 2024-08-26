const mongoose = require("mongoose");

const labSchema = mongoose.Schema({
    name: {type: String, required: true},
    roomNo:{type: String, required: true}, 
    chemicals: [{type: String}],
    inChargeId:{type: String, required: true},
});

const Lab = mongoose.model("labs", labSchema);
module.exports = Lab;