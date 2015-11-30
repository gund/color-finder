/**
 * Created by alex on 11/25/15.
 */

(function () {
    "use strict";

    var colorFinderError = function (msg) {
        return Error('ColorFinder: ' + msg);
    };

    var colorFinderConfig = {
        maxColorValue: 230 // Maximum value for RGB complement
    };

    var ColorFinder = {};

    /**
     * Update config of ColorFinder
     * @param {String} key
     * @param {*} value
     */
    ColorFinder.setConfig = function (key, value) {
        if (colorFinderConfig[key] === undefined) throw colorFinderError('setConfig: Invalid config key');
        colorFinderConfig[key] = value;
    };

    /**
     * Get most common color from image by URL
     * @param {String} imageUrl
     * @param {Function} callback
     */
    ColorFinder.fromImage = function (imageUrl, callback) {
        if (!imageUrl) throw colorFinderError('fromImage: Invalid image url');
        if (typeof callback !== 'function') throw colorFinderError('fromImage: Invalid callback');

        getPopularColor(imageUrl, callback);
    };

    window.ColorFinder = ColorFinder; // Export

    /**
     * @param {String} imgUrl
     * @param {Function} callback
     */
    function getPopularColor(imgUrl, callback) {
        if (!imgUrl) return;

        //_readBlobAsync(imgUrl, function (data) {
        var img = new Image();//, blobUrl = (window.URL || window.webkitURL).createObjectURL(data);
        //var popularColor = [0, 0, 0];

        img.onload = function () {
            //var imageData = _imageToContext(img).getImageData(0, 0, img.width, img.height);

            //var histogram = _buildHistogram(imageData.data, imageData.width * imageData.height);
            //var dominantR = histogram.r.indexOf(arrayMax(histogram.r));
            //var dominantG = histogram.g.indexOf(arrayMax(histogram.g));
            //var dominantB = histogram.b.indexOf(arrayMax(histogram.b));

            //console.log(dominantR, dominantG, dominantB);
            //popularColor = [dominantR, dominantG, dominantB];
            //handler(popularColor);

            callback(normalizeColor(ColorThief.prototype.getColor(img), colorFinderConfig.maxColorValue));
        };

        img.crossOrigin = ''; // Try to fix cross origin restriction
        img.src = imgUrl;//blobUrl;
        //});
    }

    /**
     * @param {Array} color
     * @param {Number} maxColor
     * @returns {Array}
     */
    function normalizeColor(color, maxColor) {
        if (!(color instanceof Array) || color.length < 3) throw colorFinderError('normalizeColor: Invalid color');
        if (maxColor === undefined) throw colorFinderError('normalizeColor: Invalid maxColor');

        var max = arrayMax(color);
        if (max <= maxColor) return color;

        var colorDelta = max - maxColor;
        color[0] -= colorDelta;
        color[1] -= colorDelta;
        color[2] -= colorDelta;
        return color;
    }

    /**
     * @param {CanvasPixelArray} pixels
     * @param {Number} totalPixels
     * @returns {{r: Array, g: Array, b: Array, a: Array}}
     * @private
     */
    function _buildHistogram(pixels, totalPixels) {
        var histogram = {
            r: [],
            g: [],
            b: [],
            a: []
        }, counter = pixels.length;
        var pxR, pxG, pxB, pxA;

        while (counter) {
            pxA = pixels[--counter];
            pxB = pixels[--counter];
            pxG = pixels[--counter];
            pxR = pixels[--counter];

            histogram.r[pxR] = histogram.r[pxR] !== undefined ? histogram.r[pxR] + pxR / totalPixels : pxR / totalPixels;
            histogram.g[pxG] = histogram.g[pxG] !== undefined ? histogram.g[pxG] + pxG / totalPixels : pxG / totalPixels;
            histogram.b[pxB] = histogram.b[pxB] !== undefined ? histogram.b[pxB] + pxB / totalPixels : pxB / totalPixels;
            histogram.a[pxA] = histogram.a[pxA] !== undefined ? histogram.a[pxA] + pxA / totalPixels : pxA / totalPixels;
        }

        return histogram;
    }

    /**
     * @param {String} url
     * @param {Function} handler
     * @private
     */
    function _readBlobAsync(url, handler) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) handler(this.response);
        };

        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    /**
     * @param {HTMLImageElement} image
     * @returns {CanvasRenderingContext2D}
     * @private
     */
    function _imageToContext(image) {
        if (!(image instanceof HTMLImageElement)) throw colorFinderError('_initCanvas: Invalid image');

        var ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        return ctx;
    }

    function arrayMax(arr) {
        var len = arr.length, max = 0;
        while (--len) if (arr[len] > max) max = arr[len];
        return max;
    }

})();