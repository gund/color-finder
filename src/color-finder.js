/**
 * Created by alex on 11/25/15.
 */

/**
 * @type {ColorFinder}
 */
var ColorFinder = (function () {
    "use strict";

    var CAN_USE_WORKER = ('Worker' in window);
    var WORKER_URL = 'color-finder-worker.js';

    var colorFinderError = function (msg) {
        return Error('ColorFinder: ' + msg);
    };

    var colorFinderConfig = Object.seal({
        quality: 10,
        colorsAmount: 10,
        maxColorValue: 230, // Maximum value for RGB complement
        useWebWorker: CAN_USE_WORKER, // Prefer to process in web worker
        workerPrefixPath: '' // If worker does not respond - correct path to it here and call updateWorker()
    });

    /**
     * ColorFinder Class
     * @type ColorFinder
     * @constructor
     */
    function ColorFinder() {
        // Init web worker if available
        this._worker = null;
        if (CAN_USE_WORKER) this._worker = new Worker(colorFinderConfig.workerPrefixPath + WORKER_URL);
    }

    /**
     * Update config of ColorFinder
     * @param {String} key
     * @param {*} value
     * @return ColorFinder
     */
    ColorFinder.prototype.setConfig = function (key, value) {
        if (colorFinderConfig[key] === undefined) throw colorFinderError('setConfig: Invalid config key');
        colorFinderConfig[key] = value;
        return this;
    };

    /**
     * Update config of ColorFinder
     * @param {String} key
     * @return {*}
     */
    ColorFinder.prototype.getConfig = function (key) {
        if (colorFinderConfig[key] === undefined) throw colorFinderError('setConfig: Invalid config key');
        return colorFinderConfig[key];
    };

    /**
     * Update Web Worker instance
     * <b>(Will terminate previous worker!)</b>
     * @return {ColorFinder}
     */
    ColorFinder.prototype.updateWorker = function () {
        if (this._worker instanceof Worker) this._worker.terminate();
        if (CAN_USE_WORKER) this._worker = new Worker(colorFinderConfig.workerPrefixPath + WORKER_URL);
        return this;
    };

    /**
     * Get most common color from image by URL
     * @param {String} imageUrl
     * @param {Function} callback
     * @return ColorFinder
     */
    ColorFinder.prototype.fromImage = function (imageUrl, callback) {
        if (!imageUrl) throw colorFinderError('fromImage: Invalid image url');
        if (typeof callback !== 'function') throw colorFinderError('fromImage: Invalid callback');

        this._getPopularColor(imageUrl, callback);

        return this;
    };

    /**
     * @param {String} imgUrl
     * @param {Function} callback
     * @private
     */
    ColorFinder.prototype._getPopularColor = function (imgUrl, callback) {
        if (!imgUrl) return;

        var me = this;
        var img = new Image();

        img.onload = function () {
            me._getColorFromImage.call(me, img, callback);
        };

        img.crossOrigin = ''; // Try to fix cross origin restriction
        img.src = imgUrl;
    };

    /**
     * @param {Array} color
     * @param {Number} maxColor
     * @returns {Array}
     * @private
     */
    ColorFinder.prototype._normalizeColor = function (color, maxColor) {
        if (!(color instanceof Array) || color.length < 3) throw colorFinderError('normalizeColor: Invalid color');
        if (maxColor === undefined) throw colorFinderError('normalizeColor: Invalid maxColor');

        var max = this._arrayMax(color);
        if (max <= maxColor) return color;

        var colorDelta = max - maxColor;
        color[0] = Math.max(color[0] - colorDelta, 0);
        color[1] = Math.max(color[1] - colorDelta, 0);
        color[2] = Math.max(color[2] - colorDelta, 0);
        return color;
    };

    /**
     * Get color from image
     * @param {HTMLImageElement} image
     * @param {Function} callback
     * @private
     */
    ColorFinder.prototype._getColorFromImage = function (image, callback) {
        var imageCtx = this._imageToContext(image);

        // Get image pixels
        var imageData = imageCtx.getImageData(0, 0, image.width, image.height);

        if (colorFinderConfig.useWebWorker && CAN_USE_WORKER) {
            // Listen to worker response
            this._worker.onmessage = function (e) {
                this._worker.onmessage = undefined; // Remove listener
                var data = e.data;
                var color;

                // Fallback if worker failed
                if (e.error) {
                    color = this._processPixelsToColor(imageData, colorFinderConfig.colorsAmount, colorFinderConfig.quality)[0];
                } else {
                    color = data.response[0];
                }

                // Normalize color
                color = this._normalizeColor(color, colorFinderConfig.maxColorValue);

                // Return value to callback
                callback(color);
            }.bind(this);

            // Send task to worker
            this._worker.postMessage({
                data: imageData,
                colorsAmount: colorFinderConfig.colorsAmount,
                quality: colorFinderConfig.quality
            });
        } else {
            // Get common color
            var color = this._processPixelsToColor(imageData, colorFinderConfig.colorsAmount, colorFinderConfig.quality)[0];

            // Normalize color
            color = this._normalizeColor(color, colorFinderConfig.maxColorValue);

            // Return value to callback
            callback(color);
        }
    };

    /**
     * Create virtual rendering context and draw image into it
     * @param {HTMLImageElement} image
     * @returns {CanvasRenderingContext2D}
     * @private
     */
    ColorFinder.prototype._imageToContext = function (image) {
        if (!(image instanceof HTMLImageElement)) throw colorFinderError('_initCanvas: Invalid image');

        var ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        return ctx;
    };

    /**
     * @param {Array} arr
     * @returns {number}
     * @private
     */
    ColorFinder.prototype._arrayMax = function (arr) {
        var len = arr.length, max = 0;
        while (--len > -1) if (arr[len] > max) max = arr[len];
        return max;
    };

    /**
     * Process pixels into array of most common colors
     * @param {ImageData} imageData
     * @param {Number} colorsAmount
     * @param {Number} quality
     * @return {Array}
     * @private
     */
    ColorFinder.prototype._processPixelsToColor = function (imageData, colorsAmount, quality) {
        colorsAmount = +colorsAmount;
        quality = +quality;

        var pixels = imageData.data;
        var pixelCount = imageData.width * imageData.height;

        // Store the RGB values in an array format suitable for quantize function
        var pixelArray = [];
        for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i + quality) {
            offset = i * 4;
            r = pixels[offset + 0];
            g = pixels[offset + 1];
            b = pixels[offset + 2];
            a = pixels[offset + 3];
            // If pixel is mostly opaque and not white
            if (a >= 125 && (r <= 250 || g <= 250 || b <= 250)) {
                pixelArray.push([r, g, b]);
            }
        }

        // Send array to quantize function which clusters values
        // using median cut algorithm
        var cmap = MMCQ.quantize(pixelArray, colorsAmount);

        return cmap ? cmap.palette() : [];
    };

    // Export ColorFinder
    return new ColorFinder();

})();