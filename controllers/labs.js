const Chemical = require("../models/chemicals");
const Lab = require("../models/labs");

const createLab = async(req, res) => {
    try {
        const {name, roomNo, chemicals, uid} = req.body;
        const existLab = await Lab.findOne({$and: [{name}, {roomNo}]});
        if(existLab){
            res.status(400).json({data: "lab already exists"})
        }else{
            const newLab = new Lab({
                name, roomNo, chemicals, inChargeId: uid
            });
            await newLab.save();
            res.status(200).json({data: `${name} lab created`})
        }
        console.log(existLab)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
};

const assignIncharge = async(req, res) => {
    try {
        const {inChargeId} =  req.body;
        const labid = req.params.id;
        await Lab.findByIdAndUpdate(labid, {
            inChargeId
        });
        res.status(200).json({data: "incharge assigned"})
    } catch (error) {
        console.log(error)
        res.status(500).json({data: "server error"})
    }
};

//stock updations
const stockUsage = async(req, res) => {
    try {
        const {id} = req.params.id;
        const {chemicals} = req.body;

        if(chemicals.length > 0){
            chemicals.map(async(chemical) => {
                const existChemical = await Chemical.findById(chemical.id);
                if(existChemical){
                    //use the reference logic from the notion stock usage section
                }
            })
        }else{
            res.status(400).json({data: "No chemicals list sent"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({data: "server error"})
    }
}


module.exports = {createLab, assignIncharge};