const {
   getCustOrders,
   getOrderById,
   createOrder
} = require('../controllers/orders');

const router = require('express').Router();
const auth = require('../middleware/auth');

router.post('/', auth, createOrder);

router.get('/', auth, getCustOrders);
router.get('/:id', getOrderById);

module.exports = router;