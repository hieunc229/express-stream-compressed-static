"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompressionPipe = exports.isBrotliSupport = void 0;
var zlib_1 = __importDefault(require("zlib"));
function isBrotliSupport(req) {
    var _a;
    return ((_a = req.get("accept-encoding")) === null || _a === void 0 ? void 0 : _a.indexOf("br")) !== -1;
}
exports.isBrotliSupport = isBrotliSupport;
function getCompressionPipe(withBrotli) {
    return withBrotli ? zlib_1.default.createBrotliCompress() : zlib_1.default.createGzip();
}
exports.getCompressionPipe = getCompressionPipe;
