const mongoose = require('mongoose');
const { Schema } = mongoose;


const foodItemSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        default: null
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;