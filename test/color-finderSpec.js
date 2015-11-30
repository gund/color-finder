/**
 * Created by alex on 11/30/15.
 */

var DEMO_IMAGE = '/base/example/demo-image.jpg';

describe('ColorFinder Class', function () {

    describe('Test getConfig method', function () {

        it('should get default config value', function () {
            expect(ColorFinder.getConfig('maxColorValue')).toBe(230);
        });

    });

    describe('Test setConfig method', function () {

        it('should update config value', function () {
            expect(ColorFinder.setConfig('maxColorValue', 200)).toBe(ColorFinder);
            expect(ColorFinder.getConfig('maxColorValue')).toBe(200);
        });

        it('should throw error if config key unknown', function () {
            expect(function () {
                ColorFinder.setConfig('customConfig', 'OK?');
            }).toThrow(new Error('ColorFinder: setConfig: Invalid config key'));
        });

    });

    describe('Test fromImage method', function () {

        it('should throw error if no image url', function () {
            expect(function () {
                ColorFinder.fromImage();
            }).toThrow(new Error('ColorFinder: fromImage: Invalid image url'));
        });

        it('should throw error if no callback', function () {
            expect(function () {
                ColorFinder.fromImage(DEMO_IMAGE);
            }).toThrow(new Error('ColorFinder: fromImage: Invalid callback'));
        });

        it('should proceed and call function with color', function (done) {
            expect(ColorFinder.fromImage(DEMO_IMAGE, function (color) {
                expect(color).toEqual([179, 165, 103]);
                done();
            })).toBe(ColorFinder);
        });

    });

});