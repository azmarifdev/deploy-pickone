"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptionsDelegate = void 0;
const origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://admin-frontend-xi-ten.vercel.app',
    'https://pickone-client-site.vercel.app',
];
const corsOptionsDelegate = function (req, callback) {
    const origin = req.header('Origin');
    let corsOptions;
    if (origins.some(allowedOrigin => origin === null || origin === void 0 ? void 0 : origin.startsWith(allowedOrigin))) {
        corsOptions = {
            origin,
            credentials: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            allowedHeaders: ['Content-Type', 'Authorization'],
            exposedHeaders: ['Content-Disposition'],
        };
    }
    else
        corsOptions = { origin: false };
    callback(null, corsOptions);
};
exports.corsOptionsDelegate = corsOptionsDelegate;
