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
const user_model_1 = require("./app/modules/user/user.model"); // Ensure this is exporting a Mongoose model
const config_1 = __importDefault(require("./config"));
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log('Connected to MongoDB.');
            // Check for existing admin
            const user = yield user_model_1.User.findOne({ role: 'admin' });
            if (user) {
                console.log('Admin user already exists.');
                return;
            }
            // Create admin user
            // Remove manual hashing - let the user model pre-save hook handle it
            const adminUser = new user_model_1.User({
                name: 'Admin',
                email: 'admin@gmail.com',
                password: 'admin@',
                role: 'admin',
            });
            yield adminUser.save();
            console.log('Admin user created successfully.', adminUser);
        }
        catch (error) {
            console.error('Error seeding admin user:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
        }
    });
}
seed()
    .then(() => {
    console.log('Seeding completed.');
    process.exit(0);
})
    .catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
});
exports.default = seed;
