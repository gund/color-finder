/**
 * Created by alex on 11/26/15.
 */

window.addEventListener('load', function () {
    loadAndUse('https://static.biddi.com/users/733/storecover.jpg');
});

function loadAndUse(url) {
    document.querySelector('.img-cnt').innerHTML = '<img src="' + url + '">';

    ColorFinder.fromImage(url, function (color) {
        console.log(color);
        document.querySelector('.color').style.backgroundColor = 'rgb(' + color.join(',') + ')';
    });
}