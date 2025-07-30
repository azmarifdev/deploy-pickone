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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = require("../../../shared/sendResponse");
const auth_services_1 = require("./auth.services");
const isProduction = process.env.NODE_ENV === 'production';
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield auth_services_1.AuthServices.loginUser(loginData);
    const refreshCookieOptions = {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    const accessCookieOptions = {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    // Set cookies
    if (result === null || result === void 0 ? void 0 : result.refreshToken) {
        res.cookie('pickone_refresh_token', result.refreshToken, refreshCookieOptions);
    }
    if (result === null || result === void 0 ? void 0 : result.accessToken) {
        res.cookie('pickone_access_token', result.accessToken, accessCookieOptions);
    }
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User logged successfully..!!',
        data: result === null || result === void 0 ? void 0 : result.user,
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_services_1.AuthServices.refreshToken(refreshToken);
    // Clear the old refresh token and access token
    res.clearCookie('pickone_refresh_token');
    res.clearCookie('pickone_access_token');
    const refreshCookieOptions = {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    };
    const accessCookieOptions = {
        path: '/',
        secure: isProduction,
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    };
    // Set the new refresh token in the cookie
    res.cookie('pickone_refresh_token', result === null || result === void 0 ? void 0 : result.refreshToken, refreshCookieOptions);
    // Set the new access token in the cookie
    res.cookie('pickone_access_token', result === null || result === void 0 ? void 0 : result.accessToken, accessCookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User logged successfully..!!',
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const passwordData = __rest(req.body, []);
    yield auth_services_1.AuthServices.changePassword(user, passwordData);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully !',
    });
}));
const logoutUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Clear the cookies
    res.clearCookie('pickone_refresh_token');
    res.clearCookie('pickone_access_token');
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User logged out successfully..!!',
    });
}));
exports.AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    logoutUser,
};
