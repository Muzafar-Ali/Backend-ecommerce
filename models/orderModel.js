import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({

    shippingInfo: {
        address: {
            type: String,
            required: [true, 'address is required']
        },
        city: {
            type: String,
            required: [true, 'city is required']
        },
        state: {
            type: String,
        },
        country: {
            type: String,
            required: [true, 'country is required']
        } 
    },

    orderItems: [
        {
            name: {
                type: String,
                required: [true, 'Product name is required']
            },
            price: {
                type: Number,
                required: [true, 'Product price is required']
            },
            thumbnail: {
                type: String,
                required: [true, 'Product image is required']
            },
            quantity: {
                type: Number,
                required: [true, 'Product quantity is required']
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                require: [true, 'Product id is required']
            }
        }
    ],
    
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        default: 'cash'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, 'User id is required']
    },

    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String,
    },
    itemPrice: {
        type: Number,
        default: 0,
        required: [true, 'item price is required']    
    },
    tax: {
        type: Number,
        default: 0,
        required: [true, 'tax is required']
    },
    shippingCharges: {
        type: Number,
        default: 0,
        required: [true, 'shipping charges is required']
    },
    totalAmount: {
        type: Number,
        default: 0,
        required: [true, 'total amount is required']
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'processing'
    },
    deliveredAt: Date,
    shippedAt: Date,
 
});


const Order = mongoose.models.Order || mongoose.model('Orders', orderSchema);

export default Order;
