const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/cart');

// @route   POST api/cart/
// @desc    create/add to cart
// @access  private
router.post('/', async (req, res) => {
	const { product, qty, size } = req.body;
	try {
		const id = mongoose.Types.ObjectId(req.body.user);
		const p = mongoose.Types.ObjectId(product);
		let cart = await Cart.findOne({ user: id });

		// if (cart) {
		// 	const newItem = { p, qty, size };
		// 	cart.products.unshift(newItem);
		// 	await cart.save();
		// 	return res.json(cart);
		// }
		const newItem = {};
		newItem.user = id;
		newItem.products = {};
		newItem.products.product = p;
		newItem.products.qty = qty;
		newItem.products.size = size;

		cart = new Cart(newItem);
		// await cart.save();
		return res.json(cart);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/updateqty
// @desc    update quantity
// @access  private
router.post('/updateqty', async (req, res) => {
	try {
		let id = mongoose.Types.ObjectId(req.body.product);
		const updatingQty = req.body.qty;
		const profile = await Profile.updateOne(
			{ user: req.user.id, 'products.product': id },
			{ $set: { 'products.$.qty': updatingQty } }
		);
		if (profile.n == 0) {
			return res.status(400).json({ msg: 'Cannott find object' });
		}
		res.status(200).json({ msg: 'Updated successfully' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/updatesize
// @desc    update quantity
// @access  private
router.post('/updatesize', async (req, res) => {
	try {
		let id = mongoose.Types.ObjectId(req.body.product);
		const updatingSize = req.body.size;
		const cart = await Cart.updateOne(
			{ user: req.user.id, 'products.product': id },
			{ $set: { 'products.$.size': updatingSize } }
		);
		if (cart.n == 0) {
			return res.status(400).json({ msg: 'Cannott find object' });
		}
		res.status(200).json({ msg: 'Updated successfully' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/removeitem
// @desc    Removes an item from cart
// @access  private
router.post('/removeitem', async (req, res) => {
	try {
		const removeId = mongoose.Types.ObjectId(req.body.product);
		const userId = mongoose.Types.ObjectId(req.body.user);
		const cart = await Cart.update({ user: userId }, { $pull: { products: { product: removeId } } });
		if (cart.nModified == 0) {
			return res.status(400).json({ msg: 'Cannot find the item' });
		}
		res.status(200).json({ msg: 'Item removed successfully' });
	} catch (err) {
		onsole.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/clearcart
// @desc    Removes an item from cart
// @access  private
router.post('/clearcart', async (req, res) => {
	try {
		const userId = mongoose.Types.ObjectId(req.body.user);
		const cart = await Cart.update({ user: userId }, { $pull: { products: {} } }, { multi: true });
		if (cart.nModified == 0) {
			return res.status(400).json({ msg: 'Cannot find the item' });
		}
		res.status(200).json({ msg: 'Cart cleared successfully' });
	} catch (err) {
		onsole.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
