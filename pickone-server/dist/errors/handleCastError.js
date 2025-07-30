"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (error) => {
    //
    const errors = [
        {
            path: error.path,
            message: 'Invalid _id',
        },
    ];
    return {
        statusCode: 400,
        message: 'Cast Error',
        errorMessages: errors,
    };
};
exports.handleCastError = handleCastError;
