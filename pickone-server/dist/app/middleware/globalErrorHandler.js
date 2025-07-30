"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const handleCastError_1 = require("../../errors/handleCastError");
const handleValidationError_1 = require("../../errors/handleValidationError");
const handleZodError_1 = require("../../errors/handleZodError");
// import { errorlogger } from '../../shared/logger';
const globalErrorHandler = (error, req, res, next) => {
    // //
    // config.env === 'development'
    //    ? console.log('Global error handler -->', error)
    //    : errorlogger.error('Global error handler ', error);
    console.log('Global error handler -->', error);
    let statusCode = 500;
    let message = 'Something went worng.';
    let errorMessage = [];
    // vaditaon error
    if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
        const simplyfiedError = (0, handleValidationError_1.handleValidationError)(error);
        (statusCode = simplyfiedError.statusCode),
            (message = simplyfiedError.message),
            (errorMessage = simplyfiedError.errorMessages);
        // ZodError
    }
    else if (error instanceof zod_1.ZodError) {
        const simplyfiedError = (0, handleZodError_1.handleZodError)(error);
        (statusCode = simplyfiedError.statusCode),
            (message = simplyfiedError.message),
            (errorMessage = simplyfiedError.errorMessages);
        // ApiError
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error === null || error === void 0 ? void 0 : error.statusCode;
        message = error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: 'ApiError',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
        // Cast Error
    }
    else if ((error === null || error === void 0 ? void 0 : error.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.handleCastError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessage = simplifiedError.errorMessages;
    }
    else if (error instanceof Error) {
        message = error === null || error === void 0 ? void 0 : error.message;
        errorMessage = (error === null || error === void 0 ? void 0 : error.message)
            ? [
                {
                    path: 'Error',
                    message: error === null || error === void 0 ? void 0 : error.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        status: false,
        message,
        errorMessage,
        stack: config_1.default.env !== 'production' ? error === null || error === void 0 ? void 0 : error.stack : message,
    });
};
exports.globalErrorHandler = globalErrorHandler;
