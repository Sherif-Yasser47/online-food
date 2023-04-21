const Customer = require('../db/models/customers');
const Order = require('../db/models/orders');
const sharp = require('sharp');

//   /api/customers   GET
const getAllCust = async (req, res) => {
  const customers = await Customer.find({});
  return res.send(customers)
};

//  /api/customers/logout   GET
const logout = async (req, res, next) => {
  try {

    //Logout from all devices.
    if (req.query.all === 'true') {
      req.user.tokens = []
      await req.user.save()
      return res.end()
    }
    let tokenIndex = req.user.tokens.findIndex(token => token.token === req.token);
    req.user.tokens.splice(tokenIndex, 1)
    await req.user.save()
    return res.end();
  } catch (error) {
    error.status = 403;
    return next(error);
  }
}

//  /api/customers/login   POST
const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new Error('credentials are required');
    };
    const customer = await Customer.findByCredentials(req.body.email, req.body.password);
    const token = await customer.generateAuthToken();
    return res.send({customer, token});
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

//Registering new Customer  /api/customers   POST
const registerCust = async (req, res, next) => {
  try {
    await Customer.checkEmail(req.body.email);
    const customer = new Customer(req.body);
    const token = await customer.generateAuthToken()
    await customer.save();
    return res.status(201).send({customer, token});
  }
  catch (err) {
    err.status = 400;
    next(err);
  }
};


//Uploading Customer Profile Picture.
const uploadCustomerPP = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    const imgbuffer = req.file.buffer
    const resizedImage = await sharp(imgbuffer).png().resize(200, 200).toBuffer()
    req.user.profile_pic = resizedImage;
    await req.user.save();
    res.set('Content-Type', 'image/png')
    return res.send(req.user.profile_pic)
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

//Update Customer End-Point.
const updateCust = async (req, res, next) => {
  try {
    let allowedUpdates = ['name', 'email', 'password', 'phone', 'address']
    let userUpdates = Object.keys(req.body)
    let isAllowedUpdate = userUpdates.every((update) => allowedUpdates.includes(update))
    if (isAllowedUpdate === false) {
      throw new Error('one or more fields are not existed to update')
    } else if (req.body.email) {
      await Customer.checkEmailValidity(req.body.email)
    }
    userUpdates.forEach((update) => {
      req.user[update] = req.body[update]
    })
    await req.user.save()
    return res.send({ message: 'Updated successfuly', updatedCust: req.user })
  } catch (error) {
    error.status = 400
    next(error)
  }
};

//Deleting Customer along with deleting all related documents in Orders collection.
const deleteCustomer = async (req, res, next) => {
  try {
    const deletedCust = await Customer.findByIdAndDelete(req.params.id)
    if (!deletedCust) {
      throw new Error('No user found')
    }
    await Order.deleteMany({ cust_id: deletedCust._id })
    return res.send({ message: 'deleted successfuly', deletedCust })
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports = {
  getAllCust,
  logout,
  login,
  registerCust,
  uploadCustomerPP,
  updateCust,
  deleteCustomer
};
