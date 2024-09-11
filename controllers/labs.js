const Chemical = require("../models/chemicals");
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
        console.log(existLab)

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
        const { id } = req.params.id;
        const { chemicals } = req.body;

        if (chemicals.length > 0) {
            chemicals.map(async (chemical) => {
                const existChemical = await Chemical.findById(chemical.id);
                if (existChemical) {
                    //use the reference logic from the notion stock usage section
                }
            })
        } else {
            res.status(400).json({ data: "No chemicals list sent" })
        }

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
            res.status(200).json({ data: lab })
        }else{
            res.status(404).json({ data: "Oops! Lab not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ data: "server error" });
    }
}

module.exports = { createLab, assignIncharge, getLabs, getLab };