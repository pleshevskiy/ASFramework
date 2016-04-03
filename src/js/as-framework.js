(function (window, undefined) {'use strict';
    // +include support-functions
    //
    // BUILD AS-JqLite:
    // +include jqlite/init
    // +include jqlite/events
    // +include jqlite/classes
    // +include jqlite/css
    //
    // BUILD AS-Framework:
    // +include as/init
    // +include as/classes/fixed

    $(function () { AS();});

    $(document).on('scroll', function (evt) {
        AS().each(function () {
            if (_isFunction(this.onScroll)) this.onScroll();
        });
        console.log(window.pageXOffset, window.pageYOffset);
    });


    window.$ = $;
    window.AS = AS;

}(this));