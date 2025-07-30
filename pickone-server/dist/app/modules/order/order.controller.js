"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const paginationOptions_1 = require("../../../constant/paginationOptions");
const fbConversionApi_1 = __importDefault(require("../../../helpers/fbConversionApi"));
const catchAsync_1 = require("../../../shared/catchAsync");
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../../shared/sendResponse");
const order_interface_1 = require("./order.interface");
const order_services_1 = require("./order.services");
// Create a new order
const createOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const orderData = req.body;
    const result = yield order_services_1.OrderServices.createOrder(orderData);
    // Track purchase event for Facebook Conversion API
    try {
        const sourceUrl = req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const conversionApi = new fbConversionApi_1.default({
            access_token: config_1.default.facebook.access_token,
            pixel_id: config_1.default.facebook.pixel_id,
            clientIpAddress: req.ip || req.connection.remoteAddress || '',
            clientUserAgent: req.headers['user-agent'] || '',
            fbp: ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a._fbp) || null,
            fbc: ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b._fbc) || null,
            debug: config_1.default.facebook.debug,
        });
        // Calculate total value in BDT (we'll convert to USD before sending)
        const totalValueBDT = orderData.total_price;
        // Convert BDT to USD (assuming approximate conversion rate, adjust as needed)
        const takaToUsd = totalValueBDT / 110; // Approximate conversion rate
        // Add each product to the event
        if (orderData.order_items && Array.isArray(orderData.order_items)) {
            orderData.order_items.forEach((item) => {
                conversionApi.addProduct(item.productId, item.quantity);
            });
        }
        // Send the purchase event
        conversionApi.sendEvent('Purchase', sourceUrl, { value: takaToUsd, currency: 'USD' }, { eventId: result.orderNo });
    }
    catch (error) {
        // Don't let tracking errors affect the API response
        console.error('Facebook Conversion API error:', error);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
}));
// Get all orders
const getAllOrders = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, order_interface_1.orderFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, paginationOptions_1.paginationFields);
    const result = yield order_services_1.OrderServices.getAllOrders(filters, paginationOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Orders retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Get a single order by ID
const getOrderById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.getOrderById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
// Update order status
const updateOrderStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield order_services_1.OrderServices.updateOrderStatus(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Order status updated successfully',
        data: result,
    });
}));
// Delete order
const deleteOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.deleteOrder(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Order deleted successfully',
        data: result,
    });
}));
// Cancel order
const cancelOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.cancelOrder(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Order cancelled successfully',
        data: result,
    });
}));
// Approve order
const approveOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.approveOrder(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Order approved successfully',
        data: result,
    });
}));
// Complete order
const completeOrder = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.completeOrder(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Order completed successfully',
        data: result,
    });
}));
exports.OrderController = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
    approveOrder,
    completeOrder,
};
