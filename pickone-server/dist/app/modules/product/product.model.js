"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.Specification = exports.DescriptionBlock = exports.ProductImage = void 0;
const mongoose_1 = require("mongoose");
// Image Model
const productImageSchema = new mongoose_1.Schema({
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Specification Model
const specificationSchema = new mongoose_1.Schema({
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Description Block Model
const descriptionBlockSchema = new mongoose_1.Schema({
    description: {
        type: String,
    },
    url: {
        type: String,
    },
    product_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Product Model
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    desc: String,
    thumbnail: String,
    images: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Image',
        },
    ],
    main_features: String,
    specification: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Specification',
        },
    ],
    description_blocks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'DescriptionBlock',
        },
    ],
    important_note: String,
    code: {
        type: String,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    discount: Number,
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    meta_desc: String,
    meta_keywords: [String],
    attributes: [
        {
            title: {
                type: String,
            },
            values: [
                {
                    type: String,
                },
            ],
        },
    ],
    is_published: {
        type: Boolean,
        default: false,
    },
    is_free_shipping: {
        type: Boolean,
        default: false,
    },
    show_related_products: {
        type: Boolean,
        default: false,
    },
    youtube_video: String,
    bundle_products: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
// Export all models
exports.ProductImage = (0, mongoose_1.model)('ProductImage', productImageSchema);
exports.DescriptionBlock = (0, mongoose_1.model)('DescriptionBlock', descriptionBlockSchema);
exports.Specification = (0, mongoose_1.model)('Specification', specificationSchema);
exports.Product = (0, mongoose_1.model)('Product', productSchema);
