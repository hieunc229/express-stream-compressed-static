import { Request } from "express";
import zlib from "zlib";
import path from "path";

export function isBrotliSupport(req: Request) {
    return req.get("accept-encoding")?.indexOf("br") !== -1
}

export function getCompressionPipe(withBrotli?: boolean) {
    return withBrotli ? zlib.createBrotliCompress() : zlib.createGzip();
}

export function getCacheFilePath(options: {
    ext: string,
    savePath?: string,
    filePath: string,
    reqPath: string,
    queryString?: string,
    excludeQueryString?: boolean
}) {

    // TODO: handle error when `filePath` directory doesn't exist
    let output = options.savePath ? path.join(options.savePath, options.reqPath.replace(/[=/]/g, '-')) : options.filePath

    if (!options.excludeQueryString && options.queryString) {
        output = `${output}.${options.queryString.replace(/[=/]/g, '-')}`
    }

    return `${output}.${options.ext}`;
}