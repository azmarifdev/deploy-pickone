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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FacebookConversionApi_instances, _FacebookConversionApi_getEventData;
Object.defineProperty(exports, "__esModule", { value: true });
const fb = __importStar(require("facebook-nodejs-business-sdk"));
/**
 * Facebook Conversion API Helper
 *
 * This class helps send server-side events to Facebook's Conversion API.
 * It can track various user activities like page views, product views, add to cart, purchase, etc.
 *
 * @class FacebookConversionApi
 */
class FacebookConversionApi {
    /**
     * Initialize the class with the access token and pixel id
     *
     * @param {Object} config - Configuration object
     * @param {string} config.access_token - Facebook API access token
     * @param {string} config.pixel_id - Facebook Pixel ID
     * @param {string|null} [config.phones=null] - User's phone number
     * @param {string|null} [config.email=null] - User's email
     * @param {string} config.clientIpAddress - Client's IP address
     * @param {string} [config.clientUserAgent="website"] - Client's user agent
     * @param {string|null} [config.fbp=null] - Facebook Browser ID
     * @param {string|null} [config.fbc=null] - Facebook Click ID
     * @param {boolean} [config.debug=false] - Enable debug mode
     */
    constructor({ access_token, pixel_id, phones = null, email = null, clientIpAddress, clientUserAgent = 'website', fbp = null, fbc = null, debug = false, }) {
        _FacebookConversionApi_instances.add(this);
        // Properties to store the event data
        this.contents = [];
        this.access_token = access_token;
        this.pixel_id = pixel_id;
        this.phones = phones;
        this.email = email;
        this.clientIpAddress = clientIpAddress;
        this.clientUserAgent = clientUserAgent;
        this.fbp = fbp;
        this.fbc = fbc;
        this.debug = debug;
        // Initialize user data
        this.userData = new fb.UserData()
            .setEmail(email)
            .setPhone(phones)
            .setClientIpAddress(clientIpAddress)
            .setClientUserAgent(clientUserAgent)
            .setFbp(fbp)
            .setFbc(fbc);
        this.contents = [];
        if (this.debug) {
            console.log(`userData ${JSON.stringify(this.userData)} \n`);
        }
    }
    /**
     * Add product to the contents array
     *
     * @param {string} sku - Product SKU or ID
     * @param {number} quantity - Product quantity
     */
    addProduct(sku, quantity) {
        this.contents.push(new fb.Content().setId(sku).setQuantity(quantity));
        if (this.debug) {
            console.log(`Add To Cart: ${JSON.stringify(this.contents)}\n`);
        }
    }
    /**
     * Send event to Facebook Conversion API and clear contents array after event is fired.
     *
     * @param {string} eventName - Name of the event (Purchase, ViewContent, AddToCart, etc.)
     * @param {string} sourceUrl - URL where the event occurred
     * @param {Object|null} [purchaseData=null] - Purchase data with value and currency
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    sendEvent(eventName, sourceUrl, purchaseData = null, eventData = null) {
        const eventRequest = new fb.EventRequest(this.access_token, this.pixel_id).setEvents([
            __classPrivateFieldGet(this, _FacebookConversionApi_instances, "m", _FacebookConversionApi_getEventData).call(this, eventName, sourceUrl, purchaseData, eventData),
        ]);
        // Clear the contents array after sending the event
        const result = eventRequest.execute().then((response) => response, (error) => {
            console.error('Facebook Conversion API Error:', error);
            throw error;
        });
        this.contents = [];
        if (this.debug) {
            console.log(`Event Request: ${JSON.stringify(eventRequest)}\n`);
        }
        return result;
    }
    /**
     * Track Page View event
     *
     * @param {string} sourceUrl - URL of the page
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackPageView(sourceUrl, eventData = null) {
        return this.sendEvent('PageView', sourceUrl, null, eventData);
    }
    /**
     * Track Product View event
     *
     * @param {string} productId - Product ID or SKU
     * @param {number} value - Product value/price
     * @param {string} sourceUrl - URL of the product page
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackProductView(productId, value, sourceUrl, eventData = null) {
        this.addProduct(productId, 1);
        return this.sendEvent('ViewContent', sourceUrl, { value, currency: 'USD' }, eventData);
    }
    /**
     * Track Add to Cart event
     *
     * @param {string} productId - Product ID or SKU
     * @param {number} quantity - Product quantity
     * @param {number} value - Total value of added items
     * @param {string} sourceUrl - URL where Add to Cart happened
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackAddToCart(productId, quantity, value, sourceUrl, eventData = null) {
        this.addProduct(productId, quantity);
        return this.sendEvent('AddToCart', sourceUrl, { value, currency: 'USD' }, eventData);
    }
    /**
     * Track Initiate Checkout event
     *
     * @param {Array} products - Array of products with id and quantity
     * @param {number} value - Total checkout value
     * @param {string} sourceUrl - URL of the checkout page
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackInitiateCheckout(products, value, sourceUrl, eventData = null) {
        products.forEach(product => {
            this.addProduct(product.id, product.quantity);
        });
        return this.sendEvent('InitiateCheckout', sourceUrl, { value, currency: 'USD' }, eventData);
    }
    /**
     * Track Purchase event
     *
     * @param {Array} products - Array of products with id and quantity
     * @param {number} value - Total purchase value
     * @param {string} sourceUrl - URL where purchase completed
     * @param {Object|null} [eventData=null] - Additional event data with orderId
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackPurchase(products, value, sourceUrl, eventData = null) {
        products.forEach(product => {
            this.addProduct(product.id, product.quantity);
        });
        return this.sendEvent('Purchase', sourceUrl, { value, currency: 'USD' }, eventData);
    }
    /**
     * Track Search event
     *
     * @param {string} searchTerm - Search query
     * @param {string} sourceUrl - URL of the search page
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackSearch(searchTerm, sourceUrl, eventData = null) {
        const customData = eventData
            ? Object.assign(Object.assign({}, eventData), { searchString: searchTerm }) : { searchString: searchTerm };
        return this.sendEvent('Search', sourceUrl, null, customData);
    }
    /**
     * Track product filter usage
     *
     * @param {Object} filterData - Filter criteria used
     * @param {string} sourceUrl - URL where filtering occurred
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackFilter(filterData, sourceUrl, eventData = null) {
        const customData = eventData
            ? Object.assign(Object.assign({}, eventData), { filterData }) : { filterData };
        return this.sendEvent('CustomizeProduct', sourceUrl, null, customData);
    }
    /**
     * Track bundle selection event
     *
     * @param {Array} bundleProducts - Products in the bundle
     * @param {number} value - Total bundle value
     * @param {string} sourceUrl - URL where bundle was selected
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackBundleSelection(bundleProducts, value, sourceUrl, eventData = null) {
        bundleProducts.forEach(product => {
            this.addProduct(product.id, product.quantity);
        });
        return this.sendEvent('CustomizeProduct', sourceUrl, { value, currency: 'USD' }, eventData);
    }
    /**
     * Track product clicks from listing to product page
     *
     * @param {string} productId - Product ID that was clicked
     * @param {string} sourceUrl - URL where click occurred
     * @param {Object|null} [eventData=null] - Additional event data
     * @returns {Promise} - Promise with the response from Facebook API
     */
    trackProductClick(productId, sourceUrl, eventData = null) {
        this.addProduct(productId, 1);
        return this.sendEvent('ViewContent', sourceUrl, null, eventData);
    }
}
_FacebookConversionApi_instances = new WeakSet(), _FacebookConversionApi_getEventData = function _FacebookConversionApi_getEventData(eventName, sourceUrl, purchaseData = null, eventData = null) {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    return new fb.ServerEvent()
        .setEventName(eventName)
        .setEventTime(currentTimestamp)
        .setEventId(eventData === null || eventData === void 0 ? void 0 : eventData.eventId)
        .setUserData(this.userData)
        .setCustomData(new fb.CustomData()
        .setContents(this.contents)
        .setCurrency(purchaseData === null || purchaseData === void 0 ? void 0 : purchaseData.currency)
        .setValue(purchaseData === null || purchaseData === void 0 ? void 0 : purchaseData.value))
        .setEventSourceUrl(sourceUrl)
        .setActionSource('website');
};
exports.default = FacebookConversionApi;
