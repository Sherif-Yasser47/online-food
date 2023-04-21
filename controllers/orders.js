const Order = require('../db/models/orders');

//Get all Customer Orders   /api/foodItems  GET
const getCustOrders = async (req, res, next) => {
    try {
        let sort = {};
        if (req.query.sortBy) {
            sort.createdAt = (req.query.sortBy === 'asc') ? 1 : -1
        }
        await req.user.populate({
            path: 'orders',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        return res.send(req.user.orders)
    } catch (error) {
        next(error)
    }
};

//Get Order by id    /api/foodItems/:id     GET
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
    if (!order) {
        throw new Error({ status: 404, message: 'No order found' });
    }
    return res.satus(200).send(order);
    } catch (error) {
        next(error)
    }
};

//Post Order /api/orders  POST
const createOrder = async (req, res, next) => {
    try {
        const order = new Order({
            ...req.body,
            cust_id: req.user._id,
            cust_name: req.user.name,
        })
        await order.save();
        return res.status(201).send(order);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

module.exports = {
    getCustOrders,
    getOrderById,
    createOrder
};