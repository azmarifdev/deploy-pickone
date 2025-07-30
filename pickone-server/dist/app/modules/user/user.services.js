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
exports.UserServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const fileUpload_1 = require("../../../shared/fileUpload");
const user_model_1 = require("./user.model");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.role = 'admin';
    const user = yield user_model_1.User.create(payload);
    if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
        return userWithoutPassword;
    }
    return null;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find().select('-password');
});
const userProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.findOne({ email }).select('-password');
});
const updateUser = (email, payload, image) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email, payload, image);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    const userData = __rest(payload, []);
    if (image) {
        const uploadImage = yield fileUpload_1.ImageUploadService.uploadSingleFile(image, 'user');
        userData.profile_image = uploadImage;
        if (isUserExist.profile_image) {
            yield fileUpload_1.ImageUploadService.deleteSingleFile(isUserExist.profile_image);
        }
    }
    const formattedUserData = {
        name: userData.name || isUserExist.name,
        email: userData.email || isUserExist.email,
        profile_image: userData.profile_image || isUserExist.profile_image,
    };
    const updatedUser = yield user_model_1.User.findOneAndUpdate({ email }, formattedUserData, {
        new: true,
    });
    return updatedUser;
});
exports.UserServices = {
    createUser,
    getAllUsers,
    userProfile,
    updateUser,
};
