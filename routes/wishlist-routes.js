const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Wishlist = require('../models/wishlist');
const authentication = require('../middleware/authentication');

//Add item to wishlist
router.use(authentication);
router.post('/', async (req, res) => {
	const { product } = req.body;
	try {
		const id = mongoose.Types.ObjectId(req.userData);
		const p = mongoose.Types.ObjectId(product);
		let wishlist = await Wishlist.findOne({ user: id });

		if (wishlist) {
			const newItem = { p };
			wishlist.products.unshift(newItem);
			await wishlist.save();
			return res.json(wishlist);
		}
		const newItem = {};
		newItem.products = {};
		newItem.products.product = p;

		wishlist = new Wishlist(newItem);
		await wishlist.save();
		return res.json(wishlist);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//get the wishlist
router.get('/', async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.userData);
		let wishlist = new Wishlist.findOne({ user: id }).populate('products.product', [ 'name', 'image' ]);

		if (wishlist) {
			return res.json(wishlist);
		}

		return res.json([]); // sending empty object if user doesn't have a wishlist yet
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

//remove item from wishlist
router.post('/removeitem', async (req, res) => {
	try {
		const removeId = mongoose.Types.ObjectId(req.body.product);
		const userId = mongoose.Types.ObjectId(req.userData);
		const wishlist = await Wishlist.update({ user: userId }, { $pull: { products: { product: removeId } } });
		if (wishlist.nModified == 0) {
			return res.status(400).json({ msg: 'Cannot find the item' });
		}
		res.status(200).json({ msg: 'Item removed successfully' });
	} catch (err) {
		onsole.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;
