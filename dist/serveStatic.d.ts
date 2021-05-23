import { Request, Response } from "express";
declare type StaticHandlerCacheOptions = {
    maxAge?: number;
    noTransform?: boolean;
    public?: boolean;
    additionalValue?: string;
};
declare type StaticHandlerOptions = {
    enableBrotli?: boolean;
    cacheControl?: StaticHandlerCacheOptions;
    cacheCompressedFiles?: boolean | StaticHandlerCacheCompressedFilesOptions;
};
declare type StaticHandlerCacheCompressedFilesOptions = {
    savePath?: string;
    excludeQueryString?: boolean;
};
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
export declare function serveStatic(staticPath: string, options?: StaticHandlerOptions): (req: Request, res: Response) => void;
export {};
