const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orders: [
        {
            products: [
                {
                    product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product'
                    },
                    qty: {
                        type: Number
                    },
                    size: {
                        type: String
                    },
                    price: {
                        type: Number
                    },
                    rated: {
                        type: Boolean,
                        default: false
                    }
                }
            ],
            address: [
                {
                    name: {
                        type: String
                    },
                    phone: {
                        type: String
                    },
                    address1: {
                        type: String
                    },
                    address2: {
                        type: String
                    }
                }
            ],
            payment: {
                type: String
            },
            orderCompleted: {
                type: Boolean,
                default: false
            },
            total: {
                type: Number
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = Order = mongoose.model('Order', OrderSchema);
