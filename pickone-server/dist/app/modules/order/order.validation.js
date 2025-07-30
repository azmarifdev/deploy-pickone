"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidation = void 0;
const zod_1 = require("zod");
const createOrderZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        delivery_charge: zod_1.z
            .number({
            required_error: 'Delivery charge is required',
        })
            .min(0, 'Delivery charge cannot be negative'),
        subtotal: zod_1.z
            .number({
            required_error: 'Subtotal is required',
        })
            .min(0, 'Subtotal cannot be negative'),
        total_price: zod_1.z
            .number({
            required_error: 'Total price is required',
        })
            .min(0, 'Total price cannot be negative'),
        address: zod_1.z.object({
            name: zod_1.z.string({
                required_error: 'Name is required',
            }),
            phone: zod_1.z.string({
                required_error: 'Phone is required',
            }),
            address: zod_1.z.string({
                required_error: 'Address is required',
            }),
        }),
        order_items: zod_1.z
            .array(zod_1.z.object({
            productId: zod_1.z.string({
                required_error: 'Product ID is required',
            }),
            quantity: zod_1.z
                .number({
                required_error: 'Quantity is required',
            })
                .min(1, 'Quantity must be at least 1'),
            attributes: zod_1.z
                .array(zod_1.z.object({
                title: zod_1.z.string({
                    required_error: 'Title is required',
                }),
                value: zod_1.z.string({
                    required_error: 'Value is required',
                }),
            }))
                .optional(),
            price: zod_1.z
                .number({
                required_error: 'Price is required',
            })
                .min(0, 'Price cannot be negative'),
            discount_price: zod_1.z.number().optional(),
            selling_price: zod_1.z
                .number({
                required_error: 'Selling price is required',
            })
                .min(0, 'Selling price cannot be negative'),
            subtotal: zod_1.z
                .number({
                required_error: 'Subtotal is required',
            })
                .min(0, 'Subtotal cannot be negative'),
        }))
            .nonempty('At least one order item is required'),
    }),
});
const updateOrderStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['pending', 'processing', 'completed', 'cancelled', 'returned'], {
            required_error: 'Status is required',
        }),
    }),
});
exports.OrderValidation = {
    createOrderZodSchema,
    updateOrderStatusZodSchema,
};
