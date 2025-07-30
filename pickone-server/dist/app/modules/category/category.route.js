"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
// filepath: /home/rsr/My Computer/Devlopement/Client/pickone-server/src/app/modules/category/category.route.ts
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
// Create category (protected, admin only)
router.post('/create', 
// auth(USER_ROLE.ADMIN),
(0, validateRequest_1.validateRequest)(category_validation_1.CategoryValidation.createCategoryZodSchema), category_controller_1.CategoryController.createCategory);
// Get all categories (public)
router.get('/', category_controller_1.CategoryController.getAllCategories);
// Get category by ID
router.get('/:id', category_controller_1.CategoryController.getCategoryById);
// Update category (protected, admin only)
router.patch('/:id', 
// auth(USER_ROLE.ADMIN),
(0, validateRequest_1.validateRequest)(category_validation_1.CategoryValidation.updateCategoryZodSchema), category_controller_1.CategoryController.updateCategory);
// Delete category (protected, admin only)
router.delete('/:id', 
//  auth(USER_ROLE.ADMIN),
category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
