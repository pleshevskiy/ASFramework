$(function () {
    // initial ASFramework after DOM ready
    AS();
});

// BIND scroll event
$(document).on('scroll', function () {
    AS().each(function () {
        if (_isFunction(this.onScroll)) this.onScroll();
    });
});