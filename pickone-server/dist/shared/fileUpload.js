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
exports.ImageUploadService = void 0;
const crypto_1 = require("crypto");
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const uploadSingleFile = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'File data is missing');
    }
    // Sanitize filename
    const sanitizedFilename = file.originalname
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w.-]/g, '');
    // Generate unique filename
    const filename = `${(0, crypto_1.randomBytes)(4).toString('hex')}-${sanitizedFilename}`;
    // Use absolute path for Vercel
    const tmpFolderPath = path_1.default.join('/tmp');
    const localPath = path_1.default.join(tmpFolderPath, folder, filename);
    // Ensure directory exists (no error if already exists)
    yield fs_1.default.promises.mkdir(path_1.default.dirname(localPath), { recursive: true });
    // Write file
    yield fs_1.default.promises.writeFile(localPath, file.buffer);
    // Return URL that matches your static route
    return `${config_1.default.local_file_url}tmp/${folder}/${filename}`;
});
const uploadManyFile = (files, folder) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = files.map(file => uploadSingleFile(file, folder));
    return yield Promise.all(uploadPromises);
});
const deleteSingleFile = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, '../../', url);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
});
const deleteManyFile = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(urls.map(url => deleteSingleFile(url)));
});
exports.ImageUploadService = {
    uploadSingleFile,
    uploadManyFile,
    deleteSingleFile,
    deleteManyFile,
};
