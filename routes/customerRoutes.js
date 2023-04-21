const {
   getAllCust,
   logout,
   login,
   registerCust,
   uploadCustomerPP,
   updateCust,
   deleteCustomer
} = require('../controllers/customers');

const router = require('express').Router();
const auth = require('../middleware/auth');
const uploadMW = require('../middleware/multer');


router.post('/', registerCust);
router.post('/login', login);
router.post('/pp', auth, uploadMW.single('image'), uploadCustomerPP);

router.get('/', getAllCust);
router.get('/logout', auth, logout);

router.patch('/', auth, updateCust);

router.delete('/:id', deleteCustomer);

module.exports = router;