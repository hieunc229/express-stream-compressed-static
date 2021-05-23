"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveStatic = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var mime_1 = __importDefault(require("mime"));
var utils_1 = require("./utils");
/**
 * Create the static files middleware handler
 * @param staticPath
 * @param options
 * @returns
 */
function serveStatic(staticPath, options) {
    var _a = Object.assign({ enableBrotli: true }, options), enableBrotli = _a.enableBrotli, cacheControl = _a.cacheControl;
    return function (req, res) {
        var filePath = path_1.default.join(staticPath, req.path);
        fs_1.default.stat(filePath, function (err) {
            if (!err) {
                var supportBrotli = enableBrotli && utils_1.isBrotliSupport(req);
                res.set({
                    'Content-Type': mime_1.default.lookup(filePath),
                    'Transfer-Encoding': 'chunked',
                    'Content-Encoding': supportBrotli ? 'br' : 'gzip'
                });
                setCacheControl(res, cacheControl);
                return fs_1.default.createReadStream(filePath)
                    .pipe(utils_1.getCompressionPipe(supportBrotli))
                    .pipe(res);
            }
            return res.status(404).end();
        });
    };
}
exports.serveStatic = serveStatic;
function setCacheControl(res, options) {
    if (options) {
        var rs = [];
        options.public && rs.push('public');
        options.noTransform && rs.push('no-transform');
        options.maxAge && rs.push("max-age=" + options.maxAge);
        options.additionalValue && rs.push(options.additionalValue);
        rs.length && (res.setHeader('Cache-Control', rs.join(', ')));
    }
}
