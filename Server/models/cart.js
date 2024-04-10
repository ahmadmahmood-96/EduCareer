const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    courses: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
        title: String,
        category: String,
        instructor: String,
        price: String,
        file:String,
    }]
});

const CartModel = mongoose.model('cart', cartSchema);
module.exports = CartModel;

