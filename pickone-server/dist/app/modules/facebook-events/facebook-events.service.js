"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.FacebookConversionService = exports.sendEventToFacebookAPI = exports.createTestPurchasePayload = exports.sendDirectEvent = void 0;
const fb = __importStar(require("facebook-nodejs-business-sdk"));
const config_1 = __importDefault(require("../../../config"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Direct Facebook Conversion API Service
 *
 * This service sends events directly to Facebook's Conversion API using the
 * exact payload structure from Meta Business documentation
 */
/**
 * Hash user data using SHA256 as required by Facebook
 */
const hashData = (data) => {
    return crypto_1.default
        .createHash('sha256')
        .update(data.toLowerCase().trim())
        .digest('hex');
};
/**
 * Send events to Facebook Conversion API with the official payload structure
 */
const sendDirectEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Initialize Facebook API
        fb.FacebookAdsApi.init(config_1.default.facebook.access_token);
        // Create user data
        const userData = new fb.UserData();
        if (payload.user_data.em && payload.user_data.em[0]) {
            userData.setEmail(payload.user_data.em[0]);
        }
        if (payload.user_data.ph && payload.user_data.ph[0]) {
            userData.setPhone(payload.user_data.ph[0]);
        }
        if (payload.user_data.client_ip_address) {
            userData.setClientIpAddress(payload.user_data.client_ip_address);
        }
        if (payload.user_data.client_user_agent) {
            userData.setClientUserAgent(payload.user_data.client_user_agent);
        }
        if (payload.user_data.fbp) {
            userData.setFbp(payload.user_data.fbp);
        }
        if (payload.user_data.fbc) {
            userData.setFbc(payload.user_data.fbc);
        }
        // Create custom data
        const customData = new fb.CustomData();
        if ((_a = payload.custom_data) === null || _a === void 0 ? void 0 : _a.currency) {
            customData.setCurrency(payload.custom_data.currency);
        }
        if ((_b = payload.custom_data) === null || _b === void 0 ? void 0 : _b.value) {
            customData.setValue(parseFloat(payload.custom_data.value.toString()));
        }
        // Add contents if present
        if (((_c = payload.custom_data) === null || _c === void 0 ? void 0 : _c.contents) &&
            Array.isArray(payload.custom_data.contents)) {
            const contents = payload.custom_data.contents.map(content => {
                return new fb.Content()
                    .setId(content.id)
                    .setQuantity(content.quantity)
                    .setItemPrice(content.item_price || 0);
            });
            customData.setContents(contents);
        }
        // Create server event
        const serverEvent = new fb.ServerEvent()
            .setEventName(payload.event_name)
            .setEventTime(payload.event_time)
            .setUserData(userData)
            .setCustomData(customData)
            .setEventSourceUrl(payload.event_source_url || '')
            .setActionSource(payload.action_source);
        if (payload.event_id) {
            serverEvent.setEventId(payload.event_id);
        }
        // Create event request
        const eventRequest = new fb.EventRequest(config_1.default.facebook.access_token, config_1.default.facebook.pixel_id).setEvents([serverEvent]);
        // Send the event
        const response = yield eventRequest.execute();
        return response;
    }
    catch (error) {
        console.error('Direct Facebook Conversion API Error:', error);
        throw error;
    }
});
exports.sendDirectEvent = sendDirectEvent;
/**
 * Create a test Purchase event payload exactly as shown in Meta documentation
 */
const createTestPurchasePayload = (clientIpAddress, clientUserAgent, eventSourceUrl) => {
    return {
        data: [
            {
                event_name: 'Purchase',
                event_time: Math.floor(Date.now() / 1000),
                action_source: 'website',
                user_data: {
                    em: [
                        '7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068',
                    ],
                    ph: [null],
                    client_ip_address: clientIpAddress,
                    client_user_agent: clientUserAgent,
                },
                attribution_data: {
                    attribution_share: '0.3',
                },
                custom_data: {
                    currency: 'USD',
                    value: '142.52',
                    contents: [
                        {
                            id: 'TEST_PRODUCT_123',
                            quantity: 1,
                            item_price: 142.52,
                        },
                    ],
                },
                original_event_data: {
                    event_name: 'Purchase',
                    event_time: Math.floor(Date.now() / 1000),
                },
                event_source_url: eventSourceUrl,
                event_id: `test_purchase_${Date.now()}`,
            },
        ],
    };
};
exports.createTestPurchasePayload = createTestPurchasePayload;
/**
 * Send event using Facebook's direct API endpoint
 * This makes a direct POST request to Facebook's Conversion API
 */
const sendEventToFacebookAPI = (payload, testMode = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiVersion = 'v18.0'; // Use appropriate API version
        const url = `https://graph.facebook.com/${apiVersion}/${config_1.default.facebook.pixel_id}/events`;
        const body = Object.assign({ data: Array.isArray(payload.data) ? payload.data : [payload], access_token: config_1.default.facebook.access_token }, (testMode && { test_event_code: 'TEST12345' }));
        const response = yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseData = yield response.json();
        if (!response.ok) {
            throw new Error(`Facebook API Error: ${JSON.stringify(responseData)}`);
        }
        return responseData;
    }
    catch (error) {
        console.error('Facebook API Request Error:', error);
        throw error;
    }
});
exports.sendEventToFacebookAPI = sendEventToFacebookAPI;
exports.FacebookConversionService = {
    sendDirectEvent: exports.sendDirectEvent,
    createTestPurchasePayload: exports.createTestPurchasePayload,
    sendEventToFacebookAPI: exports.sendEventToFacebookAPI,
    hashData,
};
