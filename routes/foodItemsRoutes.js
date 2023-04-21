const {
   getFoodItems,
   getItemById,
   createItem
} = require('../controllers/foodItems');

const router = require('express').Router();

router.post('/', createItem);

router.get('/', getFoodItems);
router.get('/:id', getItemById);

module.exports = router;