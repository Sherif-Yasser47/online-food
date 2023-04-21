const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    card_type: {
        type: String,
        required: [true, 'card type is required'],
        lowercase: true,
        trim: true,
        enum: { values: ['visa', 'mastercard', 'americanexpress'], message: '{VALUE} is not supported' }
    },
    card_num: {
        type: String,
        required: true,
        validate(value) {
            if (validator.isCreditCard(value.toString())) {
                throw new Error('Invalid Card Number');
            };
        }
    },
    cvv: {
        type: Number,
        required: true,
        validate(value) {
            if (value.toString().length !== 3) {
                throw new Error('Invalid CVV');
            };
        }
    },
    expiry_date: {
        type: Date,
        required: true,
        validate(value) {
            let expDate = new Date(value)
            if (expDate <= new Date()) {
                throw new Error('Expired date')
            }
        }
    }
}, {
    timestamps: true
})

const customerSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 16,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Invalid password format');
            };
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    profile_pic: {
        type: Buffer
    },
    phone: {
        type: String,
        required: true,
        validate(value) {
            if (value.length !== 11) {
                throw new Error('Invalid Phone Number');
            };
        }
    },
    address: {
        type: String,
        required: true,
        minLength: 5,
        maxLenght: 25
    },
    paymentInfo: [paymentSchema]
}, {
    timestamps: true
});

customerSchema.methods.toJSON = function () {
    const customer = this.toObject()
    delete customer.password
    delete customer.paymentInfo
    delete customer.tokens
    delete customer.profilepic
    return customer;
}

//Generating Authentication tokens for users.
customerSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString(), exp: Math.floor(Date.now() / 1000) + (86400 * 30) }, process.env.JWT_SECRET_KEY)
    this.tokens.push({token})
    await this.save()
    return token
}

//Check duplicate registration.
customerSchema.statics.checkEmail = async function (email) {
    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw new Error('Email is already registered');
    };
    return;
};

//Getting user by credentials.
customerSchema.statics.findByCredentials = async function (email, pass) {
    const customer = await this.findOne({ email });
    let err = new Error('wrong credentials');
    if (!customer) {
        throw err;
    };
    let isMatch = await bcrypt.compare(pass, customer.password);
    if (!isMatch) { throw err; }
    return customer;
};
//hasing password before saving document using pre save hook.
customerSchema.pre('save', async function () {
    if (this.$isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    };
    return;
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;