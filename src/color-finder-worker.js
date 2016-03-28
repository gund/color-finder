/**
 * Created by alex on 3/28/16.
 */

(function () {

    // Exit if executing in non worker env
    if (!('importScripts' in self)) return;

    importScripts('_mmcq.js');

    self.addEventListener('message', function (e) {
        var data = e.data;
        var imageData = data.data;
        var colorsAmount = data.colorsAmount;
        var quality = data.quality;

        try {
            postResponse(processPixelsToColor(imageData, colorsAmount, quality));
        } catch (e) {
            postError(e);
        }
    });

    function postResponse(data) {
        self.postMessage({
            response: data
        });
    }

    function postError(error) {
        self.postMessage({
            error: error
        });
    }

    /**
     * Process pixels into array of most common colors
     * @param {ImageData} imageData
     * @param {Number} colorsAmount
     * @param {Number} quality
     * @return {Array}
     * @private
     */
    function processPixelsToColor(imageData, colorsAmount, quality) {
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
    }

})();
