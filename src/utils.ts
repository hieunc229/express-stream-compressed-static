import { Request } from "express";
import zlib from "zlib";

export function isBrotliSupport(req: Request) {
    return req.get("accept-encoding")?.indexOf("br") !== -1
}

export function getCompressionPipe(withBrotli?: boolean) {
    return withBrotli ? zlib.createBrotliCompress() : zlib.createGzip();
}