/**
 * Created by alex on 11/30/15.
 */

describe('ColorFinder class', function () {

    it('should get default config value', function () {
        expect(ColorFinder.getConfig('maxColorValue')).toBe(230);
    });

    it('should update config value', function () {
        expect(ColorFinder.setConfig('maxColorValue', 200).getConfig('maxColorValue')).toBe(200);
    });

});