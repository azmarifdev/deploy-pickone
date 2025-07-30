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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookEventsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const facebook_events_service_1 = require("./facebook-events.service");
/**
 * Controller for sending Facebook Conversion API events with the exact payload structure
 * as specified in Meta Business documentation
 */
/**
 * Send events directly to Facebook Conversion API using the official payload structure
 */
const sendEventsToFacebook = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        // Add client information if not provided
        if (!payload.user_data) {
            payload.user_data = {};
        }
        if (!payload.user_data.client_ip_address) {
            payload.user_data.client_ip_address =
                req.ip || req.connection.remoteAddress || '';
        }
        if (!payload.user_data.client_user_agent) {
            payload.user_data.client_user_agent = req.headers['user-agent'] || '';
        }
        // Add event source URL if not provided
        if (!payload.event_source_url) {
            payload.event_source_url =
                req.get('Referer') ||
                    `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        }
        // Add event time if not provided
        if (!payload.event_time) {
            payload.event_time = Math.floor(Date.now() / 1000);
        }
        // Add action source if not provided
        if (!payload.action_source) {
            payload.action_source = 'website';
        }
        // Send event using Facebook SDK
        const response = yield facebook_events_service_1.FacebookConversionService.sendDirectEvent(payload);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Event sent to Facebook Conversion API successfully',
            data: {
                event_name: payload.event_name,
                event_id: payload.event_id,
                response: response,
            },
        });
    }
    catch (error) {
        console.error('Facebook Conversion API error:', error);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: `Failed to send event to Facebook Conversion API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}));
/**
 * Send events using direct Facebook API endpoint
 */
const sendEventsDirectAPI = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const payload = req.body;
        const testMode = req.query.test === 'true';
        // Ensure payload has the correct structure
        if (!payload.data && !Array.isArray(payload)) {
            // Wrap single event in data array
            const eventData = Object.assign(Object.assign({}, payload), { event_time: payload.event_time || Math.floor(Date.now() / 1000), action_source: payload.action_source || 'website', user_data: Object.assign(Object.assign({}, payload.user_data), { client_ip_address: ((_a = payload.user_data) === null || _a === void 0 ? void 0 : _a.client_ip_address) ||
                        req.ip ||
                        req.connection.remoteAddress ||
                        '', client_user_agent: ((_b = payload.user_data) === null || _b === void 0 ? void 0 : _b.client_user_agent) ||
                        req.headers['user-agent'] ||
                        '' }), event_source_url: payload.event_source_url ||
                    req.get('Referer') ||
                    `${req.protocol}://${req.get('host')}${req.originalUrl}` });
            payload.data = [eventData];
        }
        const response = yield facebook_events_service_1.FacebookConversionService.sendEventToFacebookAPI(payload, testMode);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Event sent to Facebook API successfully',
            data: response,
        });
    }
    catch (error) {
        console.error('Facebook API error:', error);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: `Failed to send event to Facebook API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}));
/**
 * Send a test Purchase event with the exact payload structure from Meta documentation
 */
const sendTestPurchaseEvent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientIpAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const clientUserAgent = req.headers['user-agent'] || 'test-agent';
        const eventSourceUrl = req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const testPayload = facebook_events_service_1.FacebookConversionService.createTestPurchasePayload(clientIpAddress, clientUserAgent, eventSourceUrl);
        // Send using direct API
        const response = yield facebook_events_service_1.FacebookConversionService.sendEventToFacebookAPI(testPayload, true);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Test Purchase event sent successfully',
            data: {
                payload: testPayload,
                response: response,
            },
        });
    }
    catch (error) {
        console.error('Test Purchase event error:', error);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: `Test Purchase event failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
    }
}));
/**
 * Helper endpoint to hash user data (email, phone) for Facebook
 */
const hashUserData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone } = req.body;
    const hashedData = {};
    if (email) {
        hashedData.em = facebook_events_service_1.FacebookConversionService.hashData(email);
    }
    if (phone) {
        // Remove all non-digits and add country code if needed
        const cleanPhone = phone.replace(/\D/g, '');
        hashedData.ph = facebook_events_service_1.FacebookConversionService.hashData(cleanPhone);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User data hashed successfully',
        data: hashedData,
    });
}));
exports.FacebookEventsController = {
    sendEventsToFacebook,
    sendEventsDirectAPI,
    sendTestPurchaseEvent,
    hashUserData,
};
