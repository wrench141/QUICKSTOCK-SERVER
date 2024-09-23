const Chemical = require("../models/chemicals");
const Experiment = require("../models/experiment");
const Lab = require("../models/labs");
const User = require("../models/user");

const createLab = async (req, res) => {
    try {
        const { name, roomNo, chemicals, inChargeId } = req.body;
        const existLab = await Lab.findOne({ $and: [{ name }, { roomNo }] });
        if (existLab) {
            res.status(400).json({ data: "lab already exists" })
        } else {
            const newLab = new Lab({
                name, roomNo, chemicals, inChargeId
            });
            await User.findOneAndUpdate({employeeId: inChargeId}, {
                role: "lab incharge"
            })
            await newLab.save();
            res.status(200).json({ data: `${name} lab created, ${chemicals.length} chemicals added!` })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "server error" })
    }
};

const assignIncharge = async (req, res) => {
    try {
        const { inChargeId } = req.body;
        const labid = req.params.id;
        await Lab.findByIdAndUpdate(labid, {
            inChargeId
        });
        res.status(200).json({ data: "incharge assigned" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "server error" })
    }
};

//stock updations
const stockUsage = async (req, res) => {
    try {
        const id = req.params.id;
        const { data } = req.body;
        
        const extLab = await Lab.findById(id);
        await Promise.all(
            extLab.chemicals.map((chemical) => {
                const match = data.chemicals.find(obj => obj.id == chemical.chemicalId)
                if(match){
                    chemical.quantity = parseInt(chemical.quantity) - parseInt(match.quantity);
                }
            })
        );
        
        const newExperiment = new Experiment(data);

        await newExperiment.save();
        await extLab.save();
        res.status(200).json({data: "record saved"})
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "server error" })
    }
} 

const getLabs = async (req, res) => {
    try {
        const labs = await Lab.find();
        const finalLabs = await Promise.all(labs.map(async (lab) => {
            const chemicals = await Promise.all(lab.chemicals.map(async (chemicalId) => {
                const chemical = await Chemical.findById(chemicalId.chemicalId);
                return chemical;
            }));
            return { ...lab._doc, chemicals };
        }));
        res.status(200).json({ data: finalLabs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "server error" });
    }
};

const getLab = async(req, res) => {
    try {
        const id = req.params.id;
        const lab = await Lab.findById(id);
        if(lab){
            const chemicals = await Promise.all(
                lab.chemicals.map(chemical => Chemical.findById(chemical.chemicalId))
            );
            lab.chemicals = chemicals;
            res.status(200).json({ data: lab, chemicals })
        }else{
            res.status(404).json({ data: "Oops! Lab not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "server error" });
    }
};


//experiments
const getExperiments = async(req, res) => {
    try {
        const {id} = req.params;
        const experiments = await Experiment.find({labId: id});
        const lab = await Lab.findById(id);
        res.status(200).json({data: experiments.length > 0 ? experiments : [], username: req.body.username, lab: lab?.name})     
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "server error" });
    }
}

const getExperiment = async(req, res) => {
    try {
        const {id} = req.params;
        const experiment = await Experiment.findById(id);
        res.status(200).json({data: experiment})
    } catch (error) {
        console.log(error)
        res.status(500).json({ data: "server error" });
    }
}

module.exports = { createLab, assignIncharge, getLabs, getLab, stockUsage, getExperiments, getExperiment };