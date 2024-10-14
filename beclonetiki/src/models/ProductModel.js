const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true},
        image: { type: String, required: true},
        imagePublicId: { type: String, required: true },
        type: { type: String, required: true},
        price: { type: Number, required: true},
        countInStock: { type: Number, required: true},
        rating: { type: Number, required: false, default: 5},
        rateCount: { type: Number, default: 0 }, 
        description: { type: String },
        disCount: { type: Number },
        selled: { type: Number }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model("Product", productSchema);

module.exports = Product