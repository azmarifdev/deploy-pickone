"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '') // Keep Bangla, English letters, numbers, and spaces
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim(); // Remove trailing spaces
};
exports.generateSlug = generateSlug;
