const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Wishlist = require('../models/wishlist');

//Add item to wishlist
router.post('/', async (req, res) => {
	const { product } = req.body;
	try {
		const id = mongoose.Types.ObjectId(req.body.user);
		const p = mongoose.Types.ObjectId(product);
		let wishlist = await Wishlist.findOne({ user: id });

		if (wishlist) {
			const newItem = { p };
			wishlist.products.unshift(newItem);
			await wishlist.save();
			return res.json(cart);
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


//remove item from wishlist
router.post('/removeitem', async (req, res) => {
	try {
		const removeId = mongoose.Types.ObjectId(req.body.product);
		const userId = mongoose.Types.ObjectId(req.body.user);
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
