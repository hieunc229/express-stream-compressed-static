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
 * @param {boolean} options.enableBrotli enable brotli compression (`true` by default)
 * @param {boolean} options.cacheCompressedFiles enable caching compressed file to avoid being compress everytime the file requested
 * @param {object} options.cacheControl set `Cache-Control` header options (options will result in a string with commas)
 * @param {number} options.cacheControl.maxAge set `max-age` in cache control options
 * @param {boolean} options.cacheControl.noTransform set `no-transform` in cache control options
 * @param {boolean} options.cacheControl.public set `public` in cache control options
 * @param {string} options.cacheControl.additionalValue set additonal value in cache control options
 * @returns
 */
function serveStatic(staticPath, options) {
    var _a = Object.assign({ enableBrotli: true }, options), enableBrotli = _a.enableBrotli, cacheControl = _a.cacheControl, cacheCompressedFiles = _a.cacheCompressedFiles;
    var cacheOptions = typeof cacheCompressedFiles === "object" ? cacheCompressedFiles : {};
    var cacheEnabled = !!cacheCompressedFiles;
    var cacheSavePath = (cacheEnabled && cacheOptions.savePath) || "";
    var cacheExcludeQueryString = cacheEnabled && cacheOptions.excludeQueryString;
    return function (req, res) {
        var filePath = path_1.default.join(staticPath, req.path);
        fs_1.default.stat(filePath, function (err) {
            if (!err) {
                var supportBrotli = enableBrotli && utils_1.isBrotliSupport(req);
                var ext = supportBrotli ? 'br' : 'gzip';
                res.set({
                    'Content-Type': mime_1.default.lookup(filePath),
                    'Transfer-Encoding': 'chunked',
                    'Content-Encoding': ext
                });
                setCacheControl(res, cacheControl);
                var cachedFilePath = utils_1.getCacheFilePath({
                    ext: ext, filePath: filePath,
                    queryString: req.url.split("?").pop(),
                    savePath: cacheSavePath,
                    reqPath: req.path
                });
                // const cachedFilePath = `${cacheSavePath ? path.join(cacheSavePath, req.path) : filePath}.${ext}`;
                if (cacheEnabled && fs_1.default.existsSync(cachedFilePath)) {
                    fs_1.default.createReadStream(cachedFilePath)
                        .pipe(res);
                    return;
                }
                var stream = fs_1.default.createReadStream(filePath);
                stream
                    .pipe(utils_1.getCompressionPipe(supportBrotli))
                    .pipe(res);
                if (cacheCompressedFiles) {
                    console.log("pipe", cachedFilePath);
                    stream
                        .pipe(utils_1.getCompressionPipe(supportBrotli))
                        .pipe(fs_1.default.createWriteStream(cachedFilePath));
                }
                return;
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
