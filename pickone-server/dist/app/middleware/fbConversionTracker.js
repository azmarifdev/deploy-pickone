"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackEvent = exports.trackPageView = void 0;
const fbConversionApi_1 = __importDefault(require("../../helpers/fbConversionApi"));
const config_1 = __importDefault(require("../../config"));
/**
 * Middleware to track page views using Facebook Conversion API
 * This can be applied to specific routes or globally
 */
const trackPageView = (req, res, next) => {
    var _a, _b;
    // Skip for non-GET requests or API endpoints that shouldn't be tracked as page views
    if (req.method !== 'GET' || req.originalUrl.startsWith('/api/') || req.xhr) {
        return next();
    }
    try {
        const sourceUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const conversionApi = new fbConversionApi_1.default({
            access_token: config_1.default.facebook.access_token,
            pixel_id: config_1.default.facebook.pixel_id,
            clientIpAddress: req.ip || req.connection.remoteAddress || '',
            clientUserAgent: req.headers['user-agent'] || '',
            fbp: ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a._fbp) || null,
            fbc: ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b._fbc) || null,
            debug: config_1.default.facebook.debug,
        });
        // Track page view asynchronously (don't wait for response)
        conversionApi
            .trackPageView(sourceUrl, { eventId: `pv_${Date.now()}` })
            .catch((error) => console.error('Facebook Conversion API error:', error));
    }
    catch (error) {
        console.error('Error in pageView tracking middleware:', error);
    }
    // Always continue to the next middleware regardless of tracking success
    next();
};
exports.trackPageView = trackPageView;
/**
 * Create a middleware to track specific event types
 * @param eventType The type of event to track (e.g., 'AddToCart', 'ViewContent')
 * @returns Middleware function
 */
const trackEvent = (eventType) => {
    return (req, res, next) => {
        var _a, _b;
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
            // Track the event asynchronously
            conversionApi
                .sendEvent(eventType, sourceUrl, null, {
                eventId: `${eventType.toLowerCase()}_${Date.now()}`,
            })
                .catch((error) => console.error('Facebook Conversion API error:', error));
        }
        catch (error) {
            console.error(`Error in ${eventType} tracking middleware:`, error);
        }
        // Always continue to the next middleware
        next();
    };
};
exports.trackEvent = trackEvent;
