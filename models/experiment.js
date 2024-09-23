const mongoose = require("mongoose");

const chemicalSchema = mongoose.Schema({
    id: {type: String, required: true},
    quantity: {type: Number, required: true}
})

const experimentSchema = mongoose.Schema({
    labId: {type: String, required: true},
    experiment: {type: String, required: true},
    length: {type: Number, required: true},
    chemicals: [chemicalSchema]
}, {timestamps: true});

const Experiment = mongoose.model("experiments", experimentSchema);
module.exports = Experiment;
