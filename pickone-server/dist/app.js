"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = require("http-status-codes");
const cors_2 = require("./app/middleware/cors");
const globalErrorHandler_1 = require("./app/middleware/globalErrorHandler");
const fbConversionTracker_1 = require("./app/middleware/fbConversionTracker");
const routes_1 = __importDefault(require("./app/routes"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
// Replace your static serving with this more robust version
app.use('/tmp', (req, res, next) => {
    const filePath = path_1.default.join('/tmp', req.path.replace(/^\/tmp\//, ''));
    fs_1.default.promises
        .access(filePath, fs_1.default.constants.F_OK)
        .then(() => {
        res.sendFile(filePath, {
            headers: {
                'Cache-Control': 'public, max-age=300',
            },
        });
    })
        .catch(() => {
        // File not found - proceed to 404 handler
        next();
    });
});
// Enable CORS
app.use((0, cors_1.default)(cors_2.corsOptionsDelegate));
app.options('*', (0, cors_1.default)(cors_2.corsOptionsDelegate));
// Parse cookies and JSON body
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '100mb' }));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '100mb',
    parameterLimit: 100000, // Increase if you have many form fields
}));
// Track page views with Facebook Conversion API
app.use(fbConversionTracker_1.trackPageView);
// application routes
app.get('/', (req, res) => {
    res.send('Server is running');
});
// use routes
app.use('/api/v1', routes_1.default);
// globalErrorHandler
app.use(globalErrorHandler_1.globalErrorHandler);
//handle not found
app.use((req, res, next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
    next();
});
exports.default = app;
