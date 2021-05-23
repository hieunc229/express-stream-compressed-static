/// <reference types="node" />
import { Request } from "express";
import zlib from "zlib";
export declare function isBrotliSupport(req: Request): boolean;
export declare function getCompressionPipe(withBrotli?: boolean): zlib.BrotliCompress;
export declare function getCacheFilePath(options: {
    ext: string;
    savePath?: string;
    filePath: string;
    reqPath: string;
    queryString?: string;
    excludeQueryString?: boolean;
}): string;
