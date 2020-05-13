const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product'
			},
			qty: {
				type: Number,
				default: 1
			},
			size: {
				type: String,
				default: 'm'
			}
		}
	]
});

module.exports = Cart = mongoose.model('Cart', CartSchema);
