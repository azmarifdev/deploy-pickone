"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookEventsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const facebook_events_controller_1 = require("./facebook-events.controller");
const router = express_1.default.Router();
// Route for sending events with Meta Business documentation payload structure
router.post('/send-event', facebook_events_controller_1.FacebookEventsController.sendEventsToFacebook);
// Route for sending test purchase event
router.get('/test-purchase', facebook_events_controller_1.FacebookEventsController.sendTestPurchaseEvent);
// Route for hashing user data (email, phone)
router.post('/hash-user-data', facebook_events_controller_1.FacebookEventsController.hashUserData);
exports.FacebookEventsRoutes = router;
