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
exports.ReviewServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationCalculate_1 = require("../../../helpers/paginationCalculate");
const fileUpload_1 = require("../../../shared/fileUpload");
const product_model_1 = require("../product/product.model");
const review_model_1 = require("./review.model");
// Create a new review
const createReview = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    if (images.length > 0) {
        // Map the images to their URLs
        const imageUrls = yield fileUpload_1.ImageUploadService.uploadManyFile(images, 'review');
        payload.images = imageUrls;
    }
    payload.rating = Number(payload.rating);
    const result = yield review_model_1.Review.create(payload);
    return result;
});
const getAllReviews = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = filters, filterData = __rest(filters, ["search"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationCalculate_1.paginationHelper.paginationCalculate(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    else {
        sortConditions['createdAt'] = 'desc';
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions = [];
    // First find products that match the search term
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let productIds = [];
    if (search) {
        const matchingProducts = yield product_model_1.Product.find({
            title: { $regex: search, $options: 'i' },
        }).select('_id');
        productIds = matchingProducts.map(p => p._id);
    }
    // Search implementation
    if (search) {
        andConditions.push({
            $or: [
                {
                    name: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                {
                    message: {
                        $regex: search,
                        $options: 'i',
                    },
                },
                // Add product ID search
                {
                    product_id: { $in: productIds },
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
    const result = yield review_model_1.Review.find(whereConditions)
        .populate({
        path: 'product_id',
        select: 'title thumbnail code',
    })
        .populate({
        path: 'images',
        select: 'url',
    })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield review_model_1.Review.countDocuments(whereConditions);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// Get a single review by ID
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findById(id)
        .populate({
        path: 'product_id',
        select: 'title thumbnail code',
    })
        .populate({
        path: 'images',
        select: 'url',
    });
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    return result;
});
// Update review status (approve or reject)
const updateReviewStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    // Update status and also update is_published flag based on status
    review.status = status;
    review.is_published = status === 'approved';
    yield review.save();
    return review;
});
// Toggle publish review
const togglePublishReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(id);
    if (!review) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    review.is_published = !review.is_published;
    yield review.save();
    return review;
});
// Delete review
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_model_1.Review.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    return result;
});
exports.ReviewServices = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReviewStatus,
    togglePublishReview,
    deleteReview,
};
