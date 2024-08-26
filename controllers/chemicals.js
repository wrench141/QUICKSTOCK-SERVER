const Chemical = require("../models/chemicals");
const Store = require("../models/store");
const xlsx = require("read-excel-file/node");
const path = require("path")

const recordChemical = async(req, res) => {
    try {
        const body = req.body;
        const existChemical = await Chemical.findOne({name: body.name.toLowerCase()});
        if(existChemical){
            res.status(403).json({data: "chemical already exists"})
        }else{
            const prefix = body.name.toString().replace(/[0-9,.\s-]/g, '').slice(0, 3).toUpperCase()
            const preCode = new RegExp(prefix);
            const existCodes = await Chemical.find({chemicalCode: {$regex: preCode, $options: 'i'}});
            let codes = [];
            for (const code of existCodes){
                codes.push(parseInt(code.chemicalCode.toString().slice(3,)))
            };
            function generateCode(ind){
                if(!codes.includes(ind)){
                    return ind
                }
                return generateCode(ind+1)
            }
            const chemicalCode = prefix + generateCode(existCodes.length)
            const newChemical = new Chemical({
                name: body.name.toLowerCase(), 
                expiresAt: new Date(body.expiresAt), 
                manufacturedDate: new Date(body.manufacturedDate),
                quantity: body.quantity,
                place: body.place,
                chemicalCode: chemicalCode
            })
            await newChemical.save();
            res.status(200).json({data: `New chemical added: ${chemicalCode}`})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
};

const preRecordData = async(req, res) => {
    try {
        const body = req.body;
        let chemicals = [];
        let i=1;
        
        xlsx(path.join(__dirname, "../utils/chemicals.xlsx")).then(async(rows) => {
            for (const row of rows) {
                let chemCode = row[1].toString().replace(/[0-9,.\s-]/g, '').slice(0, 3).toUpperCase() + i;
                const existChemical = await Chemical.findOne({ name: row[1].toLowerCase() });
                if (!existChemical) {
                    const chemicalMap = new Map(chemicals.map((chemical) => [chemical.name, chemical]))
                    if(!chemicalMap.has(row[1].toLowerCase())){
                        chemicals.push({
                            name: row[1].toLowerCase(),
                            expiresAt: new Date(), 
                            manufacturedDate: new Date(),
                            quantity: row[2] == null ? "null" : row[2],
                            place: body.place,
                            chemicalCode: chemCode
                        });
                    }else{
                        console.log("redundant", row[1])
                    }
                } else {
                    console.log("exists");
                }
                i++
            };
            let respChemicals = (await Chemical.insertMany(chemicals)).map((chem) => {return {stockType: "chemical", stockid: chem._id}});

            await Store.findOneAndUpdate({storeIncharge: req.body.uid}, {
                stock: respChemicals
            });

            console.log(respChemicals)
            res.status(200).json({data: `${chemicals.length} chemicals added`})
        });
            
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

const getAllChemicals = async(req, res) => {
    try {
        const chemicals = await Chemical.find();
        if(chemicals.length > 0){
            res.status(200).json(({data: chemicals}));
        }else{
            res.status(200).json({data: "no chemical records found"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

const removeChemical = async(req, res) => {
    try {
        const chemicalCode = req.params.code;
        await Chemical.findOneAndDelete({chemicalCode});
        res.status(202).json({data: "chemical removed"})
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
};

const removeChemicals = async(req, res) => {
    try {
        await Chemical.deleteMany({}).then(() => {
            res.status(200).json({data: "chemicals removed"})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

const updateChemical = async (req, res) => {
    try {
        const chemicalCode = req.params.code;
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

module.exports = {recordChemical, preRecordData, getAllChemicals, removeChemical, removeChemicals,  updateChemical};