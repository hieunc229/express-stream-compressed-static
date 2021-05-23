import fs from "fs";
import path from "path";
import mime from "mime";

import { Request, Response } from "express";
import { getCompressionPipe, isBrotliSupport } from "./utils";

type StaticHandlerCacheOptions = {
    maxAge?: number,
    noTransform?: boolean,
    public?: boolean,
    additionalValue?: string
}

type StaticHandlerOptions = {
    enableBrotli?: boolean,
    cacheControl?: StaticHandlerCacheOptions
}

/**
 * Create the static files middleware handler
 * @param staticPath 
 * @param options 
 * @returns 
 */
export function serveStatic(staticPath: string, options?: StaticHandlerOptions) {

    const { enableBrotli, cacheControl } = Object.assign({ enableBrotli: true }, options);

    return function (req: Request, res: Response) {
        const filePath = path.join(staticPath, req.path);

        fs.stat(filePath, (err) => {
            if (!err) {
                const supportBrotli = enableBrotli && isBrotliSupport(req);

                res.set({
                    'Content-Type': mime.lookup(filePath),
                    'Transfer-Encoding': 'chunked',
                    'Content-Encoding': supportBrotli ? 'br' : 'gzip'
                })

                setCacheControl(res, cacheControl);

                return fs.createReadStream(filePath)
                    .pipe(getCompressionPipe(supportBrotli))
                    .pipe(res)
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