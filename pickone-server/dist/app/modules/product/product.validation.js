"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        desc: zod_1.z.string().optional(),
        man_features: zod_1.z.array(zod_1.z.string()).optional(),
        specification: zod_1.z.array(zod_1.z.string()).optional(),
        important_note: zod_1.z.string().optional(),
        code: zod_1.z.string({ required_error: 'Code is required' }),
        category: zod_1.z.string({ required_error: 'Category is required' }),
        discount: zod_1.z.string().optional(),
        price: zod_1.z.string({ required_error: 'Price is required' }),
        quantity: zod_1.z.string().default('1'),
        meta_desc: zod_1.z.string().optional(),
        meta_keywords: zod_1.z.array(zod_1.z.string()).optional(),
        is_published: zod_1.z.enum(['true', 'false']).optional(),
        is_free_shipping: zod_1.z.enum(['true', 'false']).optional(),
        show_related_products: zod_1.z.enum(['true', 'false']).optional(),
        youtube_video: zod_1.z.string().optional(),
    }),
});
const updateProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'ID is required' }),
        title: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        discount: zod_1.z.number().optional(),
        price: zod_1.z.number().optional(),
        quantity: zod_1.z.number().optional(),
        desc: zod_1.z.string().optional(),
        main_features: zod_1.z.string().optional(),
        important_note: zod_1.z.string().optional(),
        attribute: zod_1.z
            .object({
            title: zod_1.z.string(),
            values: zod_1.z.array(zod_1.z.string()),
        })
            .optional(),
        specification: zod_1.z
            .array(zod_1.z.object({
            key: zod_1.z.string(),
            value: zod_1.z.string(),
        }))
            .optional(),
        meta_desc: zod_1.z.string().optional(),
        meta_keywords: zod_1.z.array(zod_1.z.string()).optional(),
        is_published: zod_1.z.boolean().optional(),
        is_free_shipping: zod_1.z.boolean().optional(),
        show_related_products: zod_1.z.boolean().optional(),
        youtube_video: zod_1.z.string().optional(),
    }),
});
exports.ProductValidation = {
    createProductSchema,
    updateProductSchema,
};
