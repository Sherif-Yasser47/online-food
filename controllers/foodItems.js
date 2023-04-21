const FoodItem = require('../db/models/foodItems');

//Get all food items /api/foodItems  GET
const getFoodItems = async (req, res, next) => {
    try {
        const items = await FoodItem.find({});
        if (items.length === 0) {
            throw new Error({ status: 404, message: 'No items found' });
        }
        return res.status(200).send(items);
    } catch (error) {
        next(error)
    }
};

//Get food item by id    /api/foodItems/:id     GET
const getItemById = async (req, res, next) => {
    try {
        const item = await FoodItem.findById(req.params.id);
        if (!item) {
            throw new Error({ status: 404, message: 'No item found by id' });
        }
        return res.satus(200).send(item);
    } catch (error) {
        next(error)
    }

};

//Post food item /api/foodItems  POST
const createItem = async (req, res, next) => {
    try {
        const item = new FoodItem(req.body);
        await item.save();
        return res.status(201).send(item);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

module.exports = {
    getFoodItems,
    getItemById,
    createItem
};