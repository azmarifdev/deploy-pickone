"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const upload_1 = require("../../../helpers/upload");
const validateRequest_1 = require("../../middleware/validateRequest");
const review_controller_1 = require("./review.controller");
const review_validation_1 = require("./review.validation");
const router = express_1.default.Router();
// Create review (public route)
router.post('/create', upload_1.upload.fields([{ name: 'images', maxCount: 10 }]), (0, validateRequest_1.validateRequest)(review_validation_1.ReviewValidation.createReviewZodSchema), review_controller_1.ReviewController.createReview);
// Get all reviews with pagination and filtering (admin only)
router.get('/lists', 
//  auth(USER_ROLE.ADMIN),
review_controller_1.ReviewController.getAllReviews);
// Get a single review by ID
router.get('/:id', 
//  auth(USER_ROLE.ADMIN),
review_controller_1.ReviewController.getReviewById);
// Update review status
router.patch('/status/:id', 
// auth(USER_ROLE.ADMIN),
(0, validateRequest_1.validateRequest)(review_validation_1.ReviewValidation.updateReviewStatusZodSchema), review_controller_1.ReviewController.updateReviewStatus);
router.patch('/toggle-publish/:id', review_controller_1.ReviewController.togglePublishReview);
// Delete review
router.delete('/:id', 
//  auth(USER_ROLE.ADMIN),
review_controller_1.ReviewController.deleteReview);
exports.ReviewRoutes = router;
