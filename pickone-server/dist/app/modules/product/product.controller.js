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
exports.ProductController = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../../config"));
const paginationOptions_1 = require("../../../constant/paginationOptions");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const fbConversionApi_1 = __importDefault(require("../../../helpers/fbConversionApi"));
const catchAsync_1 = require("../../../shared/catchAsync");
const fileUpload_1 = require("../../../shared/fileUpload");
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../../shared/sendResponse");
const product_interface_1 = require("./product.interface");
const product_model_1 = require("./product.model");
const product_services_1 = require("./product.services");
const createProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const body = req.body;
    // 1. Validate required images
    const thumbnail = files === null || files === void 0 ? void 0 : files.find(f => f.fieldname === 'thumbnail');
    const productImages = (files === null || files === void 0 ? void 0 : files.filter(f => f.fieldname === 'images')) || [];
    if (!thumbnail)
        throw new ApiError_1.default(400, 'Thumbnail is required');
    if (productImages.length < 1)
        throw new ApiError_1.default(400, 'At least 1 product image is required');
    let descriptionBlocks = [];
    if (body.description_blocks && Array.isArray(body.description_blocks)) {
        descriptionBlocks = body.description_blocks.map((block, index) => ({
            description: block === null || block === void 0 ? void 0 : block.description,
            image: files === null || files === void 0 ? void 0 : files.find(f => f.fieldname === `description_blocks[${index}][image]`),
        }));
    }
    // 2. Proceed with product creation
    const result = yield product_services_1.ProductServices.createProduct(req.body, thumbnail, productImages, descriptionBlocks);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Product created successfully',
        data: result,
    });
}));
const getProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.getProduct(id);
    // Track product view event for Facebook Conversion API
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
        // Send ViewContent event asynchronously
        conversionApi.trackProductView(result.code || result._id.toString(), result.price, sourceUrl, { eventId: `pv_${result._id.toString()}_${Date.now()}` });
    }
    catch (error) {
        // Don't let tracking errors affect the API response
        console.error('Facebook Conversion API error:', error);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: result,
    });
}));
const getProductBySlug = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { slug } = req.params;
    const result = yield product_services_1.ProductServices.getProductBySlug(slug);
    // Track product view event for Facebook Conversion API
    try {
        const sourceUrl = req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        const conversionApi = new fbConversionApi_1.default({
            access_token: config_1.default.facebook.access_token,
            pixel_id: config_1.default.facebook.pixel_id,
            clientIpAddress: req.ip || req.connection.remoteAddress || '',
            clientUserAgent: req.headers['user-agent'] || '',
            fbp: ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c._fbp) || null,
            fbc: ((_d = req.cookies) === null || _d === void 0 ? void 0 : _d._fbc) || null,
            debug: config_1.default.facebook.debug,
        });
        // Send ViewContent event asynchronously
        conversionApi.trackProductView(result.code || result._id.toString(), result.price, sourceUrl, { eventId: `pv_${result._id.toString()}_${Date.now()}` });
    }
    catch (error) {
        // Don't let tracking errors affect the API response
        console.error('Facebook Conversion API error:', error);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product retrieved successfully',
        data: result,
    });
}));
const getAllProducts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    // Extract search and filter parameters from query
    const filters = (0, pick_1.default)(req.query, product_interface_1.productSearchFilterFields);
    // Extract pagination parameters
    const paginationOptions = (0, pick_1.default)(req.query, paginationOptions_1.paginationFields);
    if (filters.is_published !== undefined) {
        filters.is_published = (filters.is_published === 'true');
    }
    if (filters.is_free_shipping !== undefined) {
        filters.is_free_shipping = (filters.is_free_shipping ===
            'true');
    }
    console.log('filters: ', filters);
    // Get products with filtering and pagination
    const result = yield product_services_1.ProductServices.getAllProducts(filters, paginationOptions);
    // Track search and filter events for Facebook Conversion API
    try {
        if (filters.searchTerm ||
            filters.category ||
            filters.tag ||
            filters.price ||
            filters.is_free_shipping) {
            const sourceUrl = req.get('Referer') ||
                `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            const conversionApi = new fbConversionApi_1.default({
                access_token: config_1.default.facebook.access_token,
                pixel_id: config_1.default.facebook.pixel_id,
                clientIpAddress: req.ip || req.connection.remoteAddress || '',
                clientUserAgent: req.headers['user-agent'] || '',
                fbp: ((_e = req.cookies) === null || _e === void 0 ? void 0 : _e._fbp) || null,
                fbc: ((_f = req.cookies) === null || _f === void 0 ? void 0 : _f._fbc) || null,
                debug: config_1.default.facebook.debug,
            });
            // If there's a search term, track search event
            if (filters.searchTerm) {
                conversionApi.trackSearch(filters.searchTerm, sourceUrl, {
                    eventId: `search_${Date.now()}`,
                });
            }
            // If there are filters, track filter event
            if (filters.category ||
                filters.tag ||
                filters.price ||
                filters.is_free_shipping) {
                conversionApi.trackFilter(filters, sourceUrl, {
                    eventId: `filter_${Date.now()}`,
                });
            }
        }
    }
    catch (error) {
        // Don't let tracking errors affect the API response
        console.error('Facebook Conversion API error:', error);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Products retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getAllProductsAdmin = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract search and filter parameters from query
    const filters = (0, pick_1.default)(req.query, product_interface_1.productSearchFilterFields);
    // Extract pagination parameters
    const paginationOptions = (0, pick_1.default)(req.query, paginationOptions_1.paginationFields);
    if (filters.is_published !== undefined) {
        filters.is_published = (filters.is_published === 'true');
    }
    if (filters.is_free_shipping !== undefined) {
        filters.is_free_shipping = (filters.is_free_shipping ===
            'true');
    }
    console.log('filters: ', filters);
    // Get products with filtering and pagination
    const result = yield product_services_1.ProductServices.getAllProductsAdmin(filters, paginationOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Products retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getBestSalesProducts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.getBestSalesProducts();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Best sales products retrieved successfully',
        data: result,
    });
}));
const togglePublishProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.togglePublishProduct(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product publish status toggled successfully',
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the service to handle image upload and product update
    const result = yield product_services_1.ProductServices.updateProduct(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product updated successfully',
        data: result,
    });
}));
const updateThumbnail = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const thumbnail = req.file;
    if (!thumbnail) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Thumbnail image is missing');
    }
    const result = yield product_services_1.ProductServices.updateThumbnail(thumbnail, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Thumbnail updated successfully',
        data: result,
    });
}));
const updateProductImages = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const productImages = files['images'];
    if (!productImages || productImages.length < 1) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'At least one product image is required');
    }
    const result = yield product_services_1.ProductServices.updateProductImages(req.params.id, productImages);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product images updated successfully',
        data: result,
    });
}));
const removeProductImage = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageId = req.params.id;
    if (!imageId) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Image ID is required');
    }
    const result = yield product_model_1.ProductImage.findByIdAndDelete(imageId);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Image not found');
    }
    // Optionally, you can also remove the image from the file system if needed
    yield fileUpload_1.ImageUploadService.deleteSingleFile(result.url);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product image removed successfully',
        data: result,
    });
}));
const deleteProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.deleteProduct(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Product deleted successfully',
        data: result,
    });
}));
const addDescriptionBlock = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file;
    const result = yield product_services_1.ProductServices.addDescriptionBlock(image, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Description block added successfully',
        data: result,
    });
}));
const updateDescriptionBlock = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.file; // This is the file from the form data (if uploaded)
    const imageUrl = req.body.image; // This is the string URL (if provided in the form)
    // Pass image and imageUrl to the service for handling
    const result = yield product_services_1.ProductServices.updateDescriptionBlock(image, imageUrl, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Description block updated successfully',
        data: result,
    });
}));
const deleteDescriptionBlock = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.ProductServices.deleteDescriptionBlock(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Description block deleted successfully',
        data: result,
    });
}));
exports.ProductController = {
    createProduct,
    getProduct,
    getAllProducts,
    togglePublishProduct,
    getBestSalesProducts,
    updateProduct,
    updateThumbnail,
    updateProductImages,
    removeProductImage,
    getAllProductsAdmin,
    getProductBySlug,
    deleteProduct,
    addDescriptionBlock,
    updateDescriptionBlock,
    deleteDescriptionBlock,
};
