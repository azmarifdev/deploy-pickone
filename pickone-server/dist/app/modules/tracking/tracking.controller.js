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
exports.TrackingController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const fbConversionApi_1 = __importDefault(require("../../../helpers/fbConversionApi"));
const config_1 = __importDefault(require("../../../config"));
/**
 * Controller for handling tracking events
 */
const trackEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { eventName, products, value, eventData, searchTerm, filterData } = req.body;
    const sourceUrl = req.body.sourceUrl ||
        req.get('Referer') ||
        `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    try {
        // Initialize Facebook Conversion API
        const conversionApi = new fbConversionApi_1.default({
            access_token: config_1.default.facebook.access_token,
            pixel_id: config_1.default.facebook.pixel_id,
            clientIpAddress: req.ip || req.connection.remoteAddress || '',
            clientUserAgent: req.headers['user-agent'] || '',
            fbp: ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a._fbp) || null,
            fbc: ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b._fbc) || null,
            debug: config_1.default.facebook.debug,
        });
        // Handle different event types
        switch (eventName) {
            case 'AddToCart':
                if (products && Array.isArray(products) && products.length > 0) {
                    products.forEach(product => {
                        conversionApi.addProduct(product.id, product.quantity);
                    });
                    const totalValue = value ||
                        products.reduce((sum, p) => sum + p.price * p.quantity, 0);
                    yield conversionApi.sendEvent('AddToCart', sourceUrl, { value: totalValue, currency: 'USD' }, eventData);
                }
                break;
            case 'ViewContent':
                if (products && Array.isArray(products) && products.length > 0) {
                    products.forEach(product => {
                        conversionApi.addProduct(product.id, 1);
                    });
                    yield conversionApi.sendEvent('ViewContent', sourceUrl, { value: value, currency: 'USD' }, eventData);
                }
                break;
            case 'Search':
                if (searchTerm) {
                    yield conversionApi.trackSearch(searchTerm, sourceUrl, eventData);
                }
                break;
            case 'InitiateCheckout':
                if (products && Array.isArray(products) && products.length > 0) {
                    products.forEach(product => {
                        conversionApi.addProduct(product.id, product.quantity);
                    });
                    yield conversionApi.sendEvent('InitiateCheckout', sourceUrl, { value: value, currency: 'USD' }, eventData);
                }
                break;
            case 'Filter':
                if (filterData) {
                    yield conversionApi.trackFilter(filterData, sourceUrl, eventData);
                }
                break;
            case 'Bundle':
                if (products && Array.isArray(products) && products.length > 0) {
                    products.forEach(product => {
                        conversionApi.addProduct(product.id, product.quantity);
                    });
                    yield conversionApi.sendEvent('CustomizeProduct', sourceUrl, { value: value, currency: 'USD' }, eventData);
                }
                break;
            case 'ProductClick':
                if (products && Array.isArray(products) && products.length > 0) {
                    const product = products[0]; // Usually only one product is clicked
                    conversionApi.addProduct(product.id, 1);
                    yield conversionApi.sendEvent('ViewContent', sourceUrl, null, eventData);
                }
                break;
            case 'PageView':
                yield conversionApi.trackPageView(sourceUrl, eventData);
                break;
            default:
                // For custom events
                if (products && Array.isArray(products) && products.length > 0) {
                    products.forEach(product => {
                        conversionApi.addProduct(product.id, product.quantity);
                    });
                }
                yield conversionApi.sendEvent(eventName, sourceUrl, value ? { value, currency: 'USD' } : null, eventData);
                break;
        }
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Event tracked successfully',
        });
    }
    catch (error) {
        console.error('Facebook Conversion API error:', error);
        // Still return success to client even if tracking fails
        // This prevents tracking issues from disrupting user experience
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Event received',
        });
    }
}));
exports.TrackingController = {
    trackEvent,
};
