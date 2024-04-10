const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    customerId: { type: String },
    paymentIntentId : { type: String },
    courses: [{
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
        title: String,
        category: String,
        instructor: String,
        price: String,
        file:String,
    }],

    subtotal : { type:String, required:true},
    payment_status: { type: String, required: true },
    // {timestamps: true}

});

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;

