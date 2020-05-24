const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Order = require('../models/order');

const getOrders = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId(req.userData.userId);

        let returnod = await Order.findOne({
            user: userId
        }).populate('orders.products.product', ['name', 'image']);

        if (returnod) {
            return res.json(returnod);
        }

        return res.json([]);
    } catch (err) {
        console.log(err);
        const error = new HttpError('Something went wrong on DB', 500);
        return next(error);
    }
};

const addOrder = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId(req.userData.userId);

        const newOrder = req.body;
        let order = await Order.findOne({
            user: userId
        });

        if (order) {
            order.orders.unshift(newOrder);
            await order.save();
        } else {
            const newItem = {};
            newItem.user = userId;
            newItem.orders = newOrder;
            let od = new Order(newItem);
            await od.save();
        }

        let returnod = await Order.findOne({
            user: userId
        }).populate('orders.products.product', ['name', 'image']);

        return res.json(returnod);
    } catch (err) {
        const error = new HttpError('Something went wrong on DB', 500);
        return next(error);
    }
};

const completeOrder = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId(req.userData.userId);
        const orderId = req.body.orderId;

        const order = await Order.update(
            {
                user: userId,
                'orders._id': orderId
            },
            { $set: { 'orders.$.orderCompleted': true } }
        );

        let returnod = await Order.findOne({
            user: userId
        }).populate('orders.products.product', ['name', 'image']);

        return res.json(returnod);
    } catch (err) {
        console.log(err);
    }
};

const itemReviewed = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId(req.userData.userId);
        const orderId = req.body.orderId;
        const prod = req.body.product;

        const order = await Order.updateMany(
            {
                user: userId,
                'orders._id': orderId,
                'orders.products.product': prod
            },
            { $set: { 'orders.$[].products.$[product].rated': true } },
            { arrayFilters: [{ 'product.product': prod }] }
        );
        let returnod = await Order.findOne({
            user: userId
        }).populate('orders.products.product', ['name', 'image']);

        return res.json(returnod);
    } catch (err) {
        console.log(err);
    }
};

exports.completeOrder = completeOrder;
exports.itemReviewed = itemReviewed;
exports.getOrders = getOrders;
exports.addOrder = addOrder;
