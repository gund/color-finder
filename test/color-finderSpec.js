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
            }).toThrow(Error('ColorFinder: setConfig: Invalid config key'));
        });

    });

    describe('Test fromImage method', function () {

        it('should throw error if no image url', function () {
            expect(function () {
                ColorFinder.fromImage();
            }).toThrow(Error('ColorFinder: fromImage: Invalid image url'));
        });

        it('should throw error if no callback', function () {
            expect(function () {
                ColorFinder.fromImage(DEMO_IMAGE);
            }).toThrow(Error('ColorFinder: fromImage: Invalid callback'));
        });

        it('should proceed and call function with color', function (done) {
            expect(ColorFinder.fromImage(DEMO_IMAGE, function (color) {
                expect(color instanceof Array).toBeTruthy();

                expect(color.length).toBe(3);

                // expect(color).toEqual([179, 165, 103]); // TODO This assertion fails on Travis environment
                expect(color[0]).toBeGreaterThan(178);
                expect(color[0]).toBeLessThan(191);

                expect(color[1]).toBeGreaterThan(164);
                expect(color[1]).toBeLessThan(177);

                expect(color[2]).toBeGreaterThan(102);
                expect(color[2]).toBeLessThan(122);

                done();
            })).toBe(ColorFinder);
        });

    });

    describe('Test _normalizeColor method', function () {

        it('should throw error if invalid color', function () {
            expect(function () {
                ColorFinder._normalizeColor();
            }).toThrow(Error('ColorFinder: normalizeColor: Invalid color'));

            expect(function () {
                ColorFinder._normalizeColor('#ff0000');
            }).toThrow(Error('ColorFinder: normalizeColor: Invalid color'));

            expect(function () {
                ColorFinder._normalizeColor([255, 0]);
            }).toThrow(Error('ColorFinder: normalizeColor: Invalid color'));
        });

        it('should throw error if no max color', function () {
            expect(function () {
                ColorFinder._normalizeColor([255, 0, 150]);
            }).toThrow(Error('ColorFinder: normalizeColor: Invalid maxColor'));
        });

        it('should return same color if in allowed range', function () {
            expect(ColorFinder._normalizeColor([255, 0, 150], 255)).toEqual([255, 0, 150]);
        });

        it('should return normalized color to be in allowed range', function () {
            expect(ColorFinder._normalizeColor([255, 0, 150], 240)).toEqual([240, 0, 135]);
        });

    });

});