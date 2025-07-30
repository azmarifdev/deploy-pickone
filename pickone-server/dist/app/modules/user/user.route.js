"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const upload_1 = require("../../../helpers/upload");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = require("../../middleware/validateRequest");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.default)(user_1.USER_ROLE.ADMIN), (0, validateRequest_1.validateRequest)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.UserController.createUser);
router.get('/', (0, auth_1.default)(user_1.USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
router.get('/me', (0, auth_1.default)(user_1.USER_ROLE.ADMIN), user_controller_1.UserController.userProfile);
router.patch('/', upload_1.upload.single('image'), (0, auth_1.default)(user_1.USER_ROLE.ADMIN), user_controller_1.UserController.updateUser);
exports.UserRoutes = router;
