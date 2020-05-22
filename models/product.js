const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  discount: { type: Number, required: true },
  qty: { type: Number, required: true },
  rating: [
    {
      userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
      rate: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  category: { type: mongoose.Types.ObjectId, required: true, ref: "Category" },
});

module.exports = mongoose.model("Product", ProductSchema);
