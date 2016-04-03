AS();

$('li').on('click', function () {
    $(this).setClass({
        'color-red': 1
    });
});

$('div').on('scroll', function (evt) {
    console.log(this.scrollTop, this.scrollLeft);
});


$(function () {
    console.log('hello world');
});