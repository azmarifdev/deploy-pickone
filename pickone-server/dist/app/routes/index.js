"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const category_route_1 = require("../modules/category/category.route");
const order_route_1 = require("../modules/order/order.route");
const product_route_1 = require("../modules/product/product.route");
const review_route_1 = require("../modules/review/review.route");
const user_route_1 = require("../modules/user/user.route");
const tracking_route_1 = require("../modules/tracking/tracking.route");
const facebook_events_route_1 = require("../modules/facebook-events/facebook-events.route");
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: '/user',
        routes: user_route_1.UserRoutes,
    },
    {
        path: '/auth',
        routes: auth_route_1.AuthRoutes,
    },
    {
        path: '/categories',
        routes: category_route_1.CategoryRoutes,
    },
    {
        path: '/product',
        routes: product_route_1.ProductRoutes,
    },
    {
        path: '/order',
        routes: order_route_1.OrderRoutes,
    },
    {
        path: '/review',
        routes: review_route_1.ReviewRoutes,
    },
    {
        path: '/tracking',
        routes: tracking_route_1.TrackingRoutes,
    },
    {
        path: '/facebook-events',
        routes: facebook_events_route_1.FacebookEventsRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
