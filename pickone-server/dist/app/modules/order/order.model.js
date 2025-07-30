"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderItem = exports.Address = void 0;
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Address = (0, mongoose_1.model)('Address', addressSchema);
const orderItemSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    attribute: [
        {
            title: {
                type: String,
            },
            value: {
                type: String,
            },
        },
    ],
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discount_price: {
        type: Number,
        min: 0,
    },
    selling_price: {
        type: Number,
        required: true,
        min: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.OrderItem = (0, mongoose_1.model)('OrderItem', orderItemSchema);
const orderSchema = new mongoose_1.Schema({
    orderNo: {
        type: String,
        required: true,
    },
    delivery_charge: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
    },
    total_price: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'completed', 'cancelled', 'returned'],
        default: 'pending',
    },
    address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Address',
    },
    order_items: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'OrderItem',
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Create indexes for frequently queried fields
orderSchema.index({ phone: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: 1 });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
