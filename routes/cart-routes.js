const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Cart = require('../models/cart');
const authentication = require('../middleware/authentication');

// @route   POST api/cart/
// @desc    create/add to cart
// @access  private
router.use(authentication);
router.post('/', async (req, res) => {
	const { product, qty, size } = req.body;
	try {
		const id = mongoose.Types.ObjectId(req.userData);
		const p = mongoose.Types.ObjectId(product);
		let cart = await Cart.findOne({ user: id });

		if (cart) {
			const newAItem = {};
			newAItem.product = p;
			newAItem.qty = qty;
			newAItem.size = size;
			cart.products.unshift(newAItem);
			await cart.save();
			return res.json(cart);
		}
		const newItem = {};
		newItem.user = id;
		newItem.products = {};
		newItem.products.product = p;
		newItem.products.qty = qty;
		newItem.products.size = size;

		cart = new Cart(newItem);
		await cart.save();
		return res.json(cart);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/load
// @desc    Get cart items
// @access  private
router.post('/load', async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.userData);
		let cart = await Cart.findOne({ user: id });
		if (cart) {
			return res.json(cart.products);
		}

		return res.json([]);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/loadCheckout
// @desc    Get cart items
// @access  private
router.post('/loadcheckout', async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.userData);
		let cart = await Cart.findOne({ user: id }).populate('products.product', [
			'name',
			'price',
			'image',
			'discount',
			'qty'
		]);
		if (cart) {
			return res.json(cart.products);
		}

		const newItem = {};
		newItem.user = id;
		let ct = new Cart(newItem);
		await ct.save();
		return res.json([]);
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
		console.log(req.userData);
		let id = mongoose.Types.ObjectId(req.body.product);
		const userId = mongoose.Types.ObjectId(req.userData);
		const updatingQty = req.body.qty;
		const cart = await Cart.update(
			{ user: req.userData, 'products.product': id },
			{ $inc: { 'products.$.qty': updatingQty } }
		);
		if (cart.n == 0) {
			return res.status(400).json({ msg: 'Cannott find object' });
		}
		const cart2 = await Cart.findOne({ user: userId }).populate('products.product', [ 'price', 'image' ]);
		res.json(cart2.products);
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
		const userId = mongoose.Types.ObjectId(req.userData);
		const updatingSize = req.body.size;
		const cart = await Cart.updateOne(
			{ user: req.userData, 'products.product': id },
			{ $set: { 'products.$.size': updatingSize } }
		);
		if (cart.n == 0) {
			return res.status(400).json({ msg: 'Cannott find object' });
		}
		const cart2 = await Cart.findOne({ user: userId });
		res.json(cart2);
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
		const userId = mongoose.Types.ObjectId(req.userData);

		const cart = await Cart.update({ user: userId }, { $pull: { products: { product: removeId } } });

		if (cart.nModified == 0) {
			return res.status(400).json({ msg: 'Cannot find the item' });
		}

		let cart2 = await Cart.findOne({ user: userId });
		res.json(cart2);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route   POST api/cart/clearcart
// @desc    Removes an item from cart
// @access  private
router.post('/clearcart', async (req, res) => {
	try {
		const userId = mongoose.Types.ObjectId(req.userData);
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
