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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
// import { errorlogger, logger } from './shared/logger';
process.on('uncaughtException', error => {
    console.log('uncaughtException error: ', error);
    // errorlogger.error(error);
    process.exit(1);
});
let server;
function connection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(index_1.default.database_url);
            // logger.info('DB is connected succesfully ....!!');
            console.log('DB is connected succesfully ....!!');
            server = app_1.default.listen(Number(index_1.default.port), '0.0.0.0', () => {
                console.log(`Application is listening on 0.0.0.0:${index_1.default.port}`);
            });
        }
        catch (err) {
            console.error('Database connection error:', err);
            console.log('server errooooooooooorrrrr');
            // errorlogger.error(err);
        }
        process.on('unhandledRejection', error => {
            console.log('unhandledRejection error : ', error);
            if (server) {
                server.close(() => {
                    process.exit(1);
                });
            }
            else {
                process.exit(1);
            }
        });
    });
}
connection();
// process.on('SIGTERM', () => {
//    logger.info('SIGTERM is received');
//    if (server) {
//       server.close();
//    }
// });
