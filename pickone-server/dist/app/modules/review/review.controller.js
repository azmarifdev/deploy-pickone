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
exports.ReviewController = void 0;
const http_status_codes_1 = require("http-status-codes");
const paginationOptions_1 = require("../../../constant/paginationOptions");
const catchAsync_1 = require("../../../shared/catchAsync");
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = require("../../../shared/sendResponse");
const review_interface_1 = require("./review.interface");
const review_services_1 = require("./review.services");
// Create a new review
const createReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const images = files['images'] || [];
    const result = yield review_services_1.ReviewServices.createReview(req.body, images);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
}));
// Get all reviews with pagination and filtering
const getAllReviews = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, review_interface_1.reviewFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, paginationOptions_1.paginationFields);
    const result = yield review_services_1.ReviewServices.getAllReviews(filters, paginationOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Reviews retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Get a single review by ID
const getReviewById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_services_1.ReviewServices.getReviewById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review retrieved successfully',
        data: result,
    });
}));
// Update review status
const updateReviewStatus = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    const result = yield review_services_1.ReviewServices.updateReviewStatus(id, status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Review status updated to ${status} successfully`,
        data: result,
    });
}));
// Toggle publish review
const togglePublishReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_services_1.ReviewServices.togglePublishReview(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review publish status toggled successfully',
        data: result,
    });
}));
// Delete review
const deleteReview = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield review_services_1.ReviewServices.deleteReview(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Review deleted successfully',
        data: result,
    });
}));
exports.ReviewController = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReviewStatus,
    togglePublishReview,
    deleteReview,
};
