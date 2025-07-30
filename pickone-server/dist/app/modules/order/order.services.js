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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationCalculate_1 = require("../../../helpers/paginationCalculate");
const order_model_1 = require("./order.model");
// Create a new order with transaction
/* const createOrder = async (payload: ICreateOrderRequest): Promise<IOrder> => {
   // Start transaction
   const session = await mongoose.startSession();
   try {
      session.startTransaction();

      // 1. Create the order first
      const orderData = {
         orderNo: `${Math.floor(Date.now() % 1000000)
            .toString()
            .padStart(6, '0')}`,
         delivery_charge: payload.delivery_charge,
         subtotal: payload.subtotal,
         total_price: payload.total_price,
      };

      const createdOrder = await Order.create([orderData], { session });
      const order = createdOrder[0];

      if (!order) {
         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create order');
      }

      // 2. Create order items and link them to the order
      const orderItemsData = payload.order_items.map(item => ({
         ...item,
         orderId: order._id,
      }));

      const createdOrderItems = await OrderItem.create(orderItemsData, {
         session,
      });

      if (!createdOrderItems?.length) {
         throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to create order items'
         );
      }

      // 3. Create address and link it to the order
      const addressData = {
         ...payload.address,
         orderId: order._id,
      };

      const createdAddress = await Address.create([addressData], { session });
      const address = createdAddress[0];

      if (!address) {
         throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Failed to create address'
         );
      }

      // 4. Update the order with the address and order items references
      order.address = address._id;
      order.order_items = createdOrderItems.map(item => item._id);
      await order.save({ session });

      // Commit transaction
      await session.commitTransaction();

      // Return the complete order with populated relationships
      const result = await Order.findById(order._id)
         .populate('address')
         .populate('order_items');

      return result as IOrder;
   } catch (error) {
      await session.abortTransaction();
      throw error;
   } finally {
      session.endSession();
   }
}; */
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Create the order first
    const orderData = {
        orderNo: `${Math.floor(Date.now() % 1000000)
            .toString()
            .padStart(6, '0')}`,
        delivery_charge: payload.delivery_charge,
        subtotal: payload.subtotal,
        total_price: payload.total_price,
    };
    const createdOrder = yield order_model_1.Order.create(orderData);
    if (!createdOrder) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create order');
    }
    const order = createdOrder;
    // 2. Create order items and link them to the order
    const orderItemsData = payload.order_items.map(item => (Object.assign(Object.assign({}, item), { orderId: order._id })));
    const createdOrderItems = yield order_model_1.OrderItem.create(orderItemsData);
    if (!(createdOrderItems === null || createdOrderItems === void 0 ? void 0 : createdOrderItems.length)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create order items');
    }
    // 3. Create address and link it to the order
    const addressData = Object.assign(Object.assign({}, payload.address), { orderId: order._id });
    const createdAddress = yield order_model_1.Address.create(addressData);
    if (!createdAddress) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to create address');
    }
    // 4. Update the order with the address and order items references
    order.address = createdAddress._id;
    order.order_items = createdOrderItems.map(item => item._id);
    yield order.save();
    // 5. Return the complete order with populated relationships
    const result = yield order_model_1.Order.findById(order._id)
        .populate('address')
        .populate('order_items');
    return result;
});
// Get all orders with filtering and pagination
const getAllOrders = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = filters, filterData = __rest(filters, ["search"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationCalculate_1.paginationHelper.paginationCalculate(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }
    else {
        sortConditions['createdAt'] = -1; // Default to descending
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions = [];
    // Search implementation
    if (search) {
        andConditions.push({
            $or: [
                {
                    orderNo: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'address.name': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'address.phone': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'address.address': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'order_items.product.title': {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    'order_items.product.code': {
                        $regex: search,
                        $options: 'i',
                    },
                },
            ],
        });
    }
    // Status filter
    if (filterData.status) {
        andConditions.push({
            status: filterData.status,
        });
    }
    // Combine all conditions
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    // Execute query with aggregation for proper searching
    const result = yield order_model_1.Order.aggregate([
        {
            $lookup: {
                from: 'addresses',
                localField: 'address',
                foreignField: '_id',
                as: 'address',
            },
        },
        { $unwind: '$address' },
        {
            $lookup: {
                from: 'orderitems',
                localField: 'order_items',
                foreignField: '_id',
                as: 'order_items',
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'order_items.productId',
                foreignField: '_id',
                as: 'productsData',
            },
        },
        {
            $unwind: {
                path: '$order_items',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                'order_items.product': {
                    $arrayElemAt: [
                        '$productsData',
                        {
                            $indexOfArray: [
                                '$productsData._id',
                                '$order_items.productId',
                            ],
                        },
                    ],
                },
            },
        },
        {
            $group: {
                _id: '$_id',
                orderNo: { $first: '$orderNo' },
                delivery_charge: { $first: '$delivery_charge' },
                subtotal: { $first: '$subtotal' },
                total_price: { $first: '$total_price' },
                status: { $first: '$status' },
                createdAt: { $first: '$createdAt' },
                updatedAt: { $first: '$updatedAt' },
                address: { $first: '$address' },
                order_items: {
                    $push: {
                        $cond: [
                            { $ne: ['$order_items', null] },
                            {
                                _id: '$order_items._id',
                                productId: '$order_items.productId',
                                orderId: '$order_items.orderId',
                                quantity: '$order_items.quantity',
                                attribute: '$order_items.attribute',
                                price: '$order_items.price',
                                discount_price: '$order_items.discount_price',
                                selling_price: '$order_items.selling_price',
                                subtotal: '$order_items.subtotal',
                                total_price: '$order_items.total_price',
                                product: '$order_items.product',
                            },
                            '$$REMOVE',
                        ],
                    },
                },
            },
        },
        { $match: whereConditions },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
    ]);
    // For total count (without pagination)
    const total = yield order_model_1.Order.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// Get a single order by ID
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findById(id)
        .populate('address')
        .populate('order_items');
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    return result;
});
// Update order status
const updateOrderStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(id);
    if (!order) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
    }
    order.status = status;
    const result = yield order.save();
    return result;
});
// Delete order
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Find the order
        const order = yield order_model_1.Order.findById(id);
        if (!order) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Order not found');
        }
        // Delete related order items
        yield order_model_1.OrderItem.deleteMany({ orderId: id }, { session });
        // Delete related address
        yield order_model_1.Address.findOneAndDelete({ orderId: id }, { session });
        // Delete the order
        const result = yield order_model_1.Order.findByIdAndDelete(id, { session });
        // Commit transaction
        yield session.commitTransaction();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// Process methods for specific status changes
const cancelOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return updateOrderStatus(id, 'cancelled');
});
const approveOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return updateOrderStatus(id, 'processing');
});
const completeOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return updateOrderStatus(id, 'completed');
});
exports.OrderServices = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
    approveOrder,
    completeOrder,
};
const node_cron_1 = __importDefault(require("node-cron"));
const product_model_1 = require("../product/product.model");
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const orders = yield order_model_1.Order.find()
        .limit(2)
        .sort({ createdAt: -1 })
        .populate('address')
        .populate('order_items');
    const formattedOrders = [];
    for (const order of orders) {
        // Type cast populated fields
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const populatedOrder = order;
        const formattedOrder = {
            id: order.orderNo,
            status: 'processing',
            date_created: (_a = order.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
            discount_total: ((_c = (_b = populatedOrder.order_items) === null || _b === void 0 ? void 0 : _b.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc, item) => { var _a; return acc + ((_a = item === null || item === void 0 ? void 0 : item.discount_price) !== null && _a !== void 0 ? _a : 0); }, 0)) !== null && _c !== void 0 ? _c : 0).toFixed(2),
            shipping_total: ((_d = order === null || order === void 0 ? void 0 : order.delivery_charge) !== null && _d !== void 0 ? _d : 0).toFixed(2),
            total: (_f = (_e = order === null || order === void 0 ? void 0 : order.total_price) === null || _e === void 0 ? void 0 : _e.toFixed(2)) !== null && _f !== void 0 ? _f : '0.0',
            shipping: {
                full_name: (_h = (_g = populatedOrder === null || populatedOrder === void 0 ? void 0 : populatedOrder.address) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : '',
                address: (_k = (_j = populatedOrder === null || populatedOrder === void 0 ? void 0 : populatedOrder.address) === null || _j === void 0 ? void 0 : _j.address) !== null && _k !== void 0 ? _k : '',
                phone: (_m = (_l = populatedOrder === null || populatedOrder === void 0 ? void 0 : populatedOrder.address) === null || _l === void 0 ? void 0 : _l.phone) !== null && _m !== void 0 ? _m : '',
                customer_note: '',
            },
            payment_method: 'cod',
            payment_method_title: 'Cash on delivery',
            number: order.orderNo,
            line_items: [],
            shipping_lines: [
                {
                    id: '711',
                    method_title: 'ফ্রি ডেলিভারি',
                    method_id: 'free_shipping',
                    instance_id: '1',
                    total: ((_o = order === null || order === void 0 ? void 0 : order.delivery_charge) !== null && _o !== void 0 ? _o : 0).toFixed(2),
                },
            ],
        };
        for (const item of (_p = populatedOrder.order_items) !== null && _p !== void 0 ? _p : []) {
            const product = yield ((_q = product_model_1.Product.findById(item === null || item === void 0 ? void 0 : item.productId)) === null || _q === void 0 ? void 0 : _q.lean());
            formattedOrder.line_items.push({
                id: (_s = (_r = item === null || item === void 0 ? void 0 : item._id) === null || _r === void 0 ? void 0 : _r.toString()) !== null && _s !== void 0 ? _s : '',
                name: (_t = product === null || product === void 0 ? void 0 : product.title) !== null && _t !== void 0 ? _t : 'Product wes deleted',
                sku: (_u = product === null || product === void 0 ? void 0 : product.code) !== null && _u !== void 0 ? _u : '',
                quantity: (_v = item === null || item === void 0 ? void 0 : item.quantity) !== null && _v !== void 0 ? _v : 0,
                subtotal: ((_w = item === null || item === void 0 ? void 0 : item.subtotal) !== null && _w !== void 0 ? _w : 0).toFixed(2),
                total: ((_x = item === null || item === void 0 ? void 0 : item.subtotal) !== null && _x !== void 0 ? _x : 0).toFixed(2),
                price: ((_y = item === null || item === void 0 ? void 0 : item.selling_price) !== null && _y !== void 0 ? _y : 0).toFixed(2),
                image: {
                    id: (_0 = (_z = product === null || product === void 0 ? void 0 : product._id) === null || _z === void 0 ? void 0 : _z.toString()) !== null && _0 !== void 0 ? _0 : '',
                    src: (_1 = product === null || product === void 0 ? void 0 : product.thumbnail) !== null && _1 !== void 0 ? _1 : '',
                },
            });
        }
        formattedOrders.push(formattedOrder);
    }
    // // Send formatted orders to webhook
    // try {
    //    const response = await fetch(
    //       'https://sfs.karbari.app/webhook/v1/order/7786b8a3-bce8-4901-ae77-c0c53c2bfd11',
    //       {
    //          method: 'POST',
    //          headers: {
    //             'Content-Type': 'application/json',
    //             'X-karbari-custom-secret': 'a40b44955ae0f71a4a84',
    //          },
    //          body: JSON.stringify(formattedOrders),
    //       }
    //    );
    //    console.log(response);
    //    if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //    }
    //    const result = await response.json();
    //    console.log('Webhook response:', result);
    // } catch (error) {
    //    console.error('Error sending webhook:', error);
    // }
    console.log('Cron job executed');
}));
