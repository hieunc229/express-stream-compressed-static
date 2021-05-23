import fs from "fs";
import path from "path";
import mime from "mime";

import { Request, Response } from "express";
import { getCacheFilePath, getCompressionPipe, isBrotliSupport } from "./utils";

type StaticHandlerCacheOptions = {
    maxAge?: number,
    noTransform?: boolean,
    public?: boolean,
    additionalValue?: string
}

type StaticHandlerOptions = {
    enableBrotli?: boolean,
    cacheControl?: StaticHandlerCacheOptions,
    cacheCompressedFiles?: boolean | StaticHandlerCacheCompressedFilesOptions
}

type StaticHandlerCacheCompressedFilesOptions = {
    savePath?: string,
    excludeQueryString?: boolean
}

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
export function serveStatic(staticPath: string, options?: StaticHandlerOptions) {

    const { enableBrotli, cacheControl, cacheCompressedFiles } = Object.assign({ enableBrotli: true }, options);

    let cacheOptions = typeof cacheCompressedFiles === "object" ? cacheCompressedFiles : {};
    let cacheEnabled = !!cacheCompressedFiles;
    let cacheSavePath = (cacheEnabled && cacheOptions.savePath) || "";
    let cacheExcludeQueryString = cacheEnabled && cacheOptions.excludeQueryString;

    return function (req: Request, res: Response) {
        const filePath = path.join(staticPath, req.path);

        fs.stat(filePath, (err) => {
            if (!err) {

                const supportBrotli = enableBrotli && isBrotliSupport(req);
                const ext = supportBrotli ? 'br' : 'gzip';

                res.set({
                    'Content-Type': mime.lookup(filePath),
                    'Transfer-Encoding': 'chunked',
                    'Content-Encoding': ext
                })

                setCacheControl(res, cacheControl);

                const cachedFilePath = getCacheFilePath({
                    ext, filePath, 
                    queryString: (!cacheExcludeQueryString && req.url.split("?").pop()) || undefined, 
                    savePath: cacheSavePath,
                    reqPath: req.path
                })

                if (cacheEnabled && fs.existsSync(cachedFilePath)) {
                    fs.createReadStream(cachedFilePath)
                        .pipe(res)
                    return;
                }

                const stream = fs.createReadStream(filePath);

                stream
                    .pipe(getCompressionPipe(supportBrotli))
                    .pipe(res)

                if (cacheCompressedFiles) {
                    stream
                        .pipe(getCompressionPipe(supportBrotli))
                        .pipe(fs.createWriteStream(cachedFilePath))
                }

                return;
            }

            return res.status(404).end();
        })
    }
}

function setCacheControl(res: Response, options?: StaticHandlerCacheOptions) {

    if (options) {
        let rs: string[] = [];

        options.public && rs.push('public');
        options.noTransform && rs.push('no-transform');
        options.maxAge && rs.push(`max-age=${options.maxAge}`);
        options.additionalValue && rs.push(options.additionalValue);

        rs.length && (res.setHeader('Cache-Control', rs.join(', ')))
    }
}
