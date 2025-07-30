"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
// Create order (public route)
router.post('/create', (0, validateRequest_1.validateRequest)(order_validation_1.OrderValidation.createOrderZodSchema), order_controller_1.OrderController.createOrder);
// Get all orders (protected, admin only)
router.get('/list', 
//  auth(USER_ROLE.ADMIN),
order_controller_1.OrderController.getAllOrders);
// Get order by ID (protected)
router.get('/:id', 
//  auth(USER_ROLE.ADMIN),
order_controller_1.OrderController.getOrderById);
// Update order status (protected, admin only)
router.patch('/status/:id', 
// auth(USER_ROLE.ADMIN),
(0, validateRequest_1.validateRequest)(order_validation_1.OrderValidation.updateOrderStatusZodSchema), order_controller_1.OrderController.updateOrderStatus);
// Delete order (protected, admin only)
router.delete('/:id', 
//  auth(USER_ROLE.ADMIN),
order_controller_1.OrderController.deleteOrder);
// Cancel order (protected, admin only)
router.patch('/cancel/:id', 
// auth(USER_ROLE.ADMIN),
order_controller_1.OrderController.cancelOrder);
// Approve order (protected, admin only)
router.patch('/approve/:id', 
// auth(USER_ROLE.ADMIN),
order_controller_1.OrderController.approveOrder);
// Complete order (protected, admin only)
router.patch('/complete/:id', 
// auth(USER_ROLE.ADMIN),
order_controller_1.OrderController.completeOrder);
exports.OrderRoutes = router;
