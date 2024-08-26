const Store = require("../models/store");
const uuid = require("uuid")

const createStore = async(req, res) => {
    try {
        const newStore = new Store({
            storeId: req.body.storeId,
            storeIncharge: req.body.uid
        })
        await newStore.save();
        res.status(200).json({data: "store created"})
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

const getStore = async(req, res) => {
    try {
        const store = await Store.find();
        res.status(200).json({data: store})
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}


const updateStock = async(req, res) => {
    try {
        const storeId = req.params.storeId;
        const store = await Store.findOne({storeId});
        if(store){
            const stock = req.body.stock;

            const inStoreStock = [...store.stock]
            stock?.map((item) => inStoreStock.push(item));

            store.stock = inStoreStock;
            await store.save();
            res.status(202).json({data: "store updated"})
        }else{
            res.status(404).json({data: "store not found"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}


const removeStore = async(req, res) => {
    try {
        await Store.findOneAndDelete({storeId: req.params.storeId});
        res.status(200).json({data: "store removed"});
    } catch (error) {
        console.log(error);
        res.status(500).json({data: "server error"})
    }
}

module.exports = {createStore, getStore, updateStock, removeStore}