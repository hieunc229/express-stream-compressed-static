# express-stream-compressed-static

An expressjs middleware, to compress and stream static files. Support `brotli` and `gzip` compression (if brotli is enabled, and user's browser also support, brotli use be used)

Table of contents:
1. [Usage example](1-usage-example)
2. [Installation](2-installation)
3. [Usage Details](3-usage-details)
4. [License (MIT)](4-license)
5. [Changelog][5-changelog]
6. [Question and Feedback](6-question-and-feedback)

## 1. Usage example

```js
// import using require
const serveStatic = require("express-stream-compressed-static")

// import in ES6
import serveStatic from "express-stream-compressed-static";
import path from "path"


// ... your express app
// const app = Express();

// Should be the first
app.use("/static", serveStatic(path.join(__dirname, "../path-to-static-dir")))

// Or with options
app.use("/static", serveStatic(path.join(__dirname, "../path-to-static-dir"), {
    enableBrotli: boolean,
    cacheControl: {
        maxAge: numbe,
        noTransform: boolean,
        public: boolean,
        additionalValue: string
    }
}))

```

## 2. Installation

`express-stream-compressed-static` is available on npmjs, and can be install via `npm` or `yarn` as following (without `$` ofcourse):

```sh
# with npm
$ npm i express-stream-compressed-static --save

# with yarn
$ yarn add express-stream-compressed-static
```

## 3. Usage Details

**serveStatic(path: string, options: StaticHandlerOptions) => Function**: Get the middleware handler to compress and stream static files
- `path`: path to the static directory
- `options`: see `StaticHandlerOptions` below

**type StaticHandlerOptions**
- `enableBrotli {boolean}`: enable brotli compress when client's browser supported. `true` by default.
- `cacheControl {StaticHandlerCacheOptions | optional}`: cache control options
- `cacheCompressedFiles {boolean | StaticHandlerCacheCompressedFilesOptions}`: cache compressed files to avoid re-compress files

**type StaticHandlerCacheOptions**
- `maxAge {number}`: add `max-age` to cache control options (in seconds)
- `noTransform {boolean}`: add `no-transform` to cache control options
- `public {boolean}`: add `public` to cache control options
- `additionalValue {string}`: add this value to cache control options
*For example, when `maxAge`, `noTransform` and `public` is set, result will be `Cache-Control: max-age=xxxx, no-transform, public`

**type StaticHandlerCacheCompressedFilesOptions**
- `savePath {string}`: specify where the cache files will be stored. Otherwise, it will store file in same directory as the original file
- `excludeQueryString {boolean}`: save compressed file name without queryString (`false` by default). For example, your file url is `path/bundle.js?v=0.0.1` and using brotli compression, when the value to `true`, the filename will be `save-path/bundle.js.br`. Otherwise, the filename will be `save-path/bundle.js?v=0.0.1.br`

## 4. License

MIT

## 5. Changelog

- [0.0.2] added `options.cacheCompressedFiles`
- [0.0.1] publish inital version

## 6. Question and Feedback

Feel free to [start a thread](https://github.com/hieunc229/express-stream-compressed-static/issues/new) for question, or feedback.