"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        product_id: zod_1.z.string({
            required_error: 'Product ID is required',
        }),
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        phone: zod_1.z.string({
            required_error: 'Phone is required',
        }),
        message: zod_1.z.string().optional(),
        rating: zod_1.z
            .string({
            required_error: 'Rating is required',
        })
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5')
            .transform(val => Number(val)),
        images: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
const updateReviewStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'approved', 'rejected'], {
            required_error: 'Status is required',
        }),
    }),
});
exports.ReviewValidation = {
    createReviewZodSchema,
    updateReviewStatusZodSchema,
};
