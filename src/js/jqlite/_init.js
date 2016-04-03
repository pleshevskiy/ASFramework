
function ASJqLite(selector) {
    if (_isFunction(selector)) {
        $(document).on('ready', selector);
        return;
    }
    var elements;
    if (selector.nodeType || selector === window) {
        elements = [selector];
    } else if (_isLikeArray(selector) && (selector.length === 0 || selector[0].nodeType)) {
        elements = selector;
    } else {
        elements = document.querySelectorAll(selector);
    }
    $.extend(this, elements);
    this.length = elements.length;
}
function $(selector) {
    return new ASJqLite(selector);
}
$.each = function (object, iterator, context) {
    if (_isLikeArray(object)) {
        for (var i = 0, max = object.length; i < max; ++i) {
            if (iterator.call(context, object[i], i, object) === false) return;
        }
    } else {
        for (var key in object) if (object.hasOwnProperty(key)) {
            if (iterator.call(context, object[key], key, object) === false) return;
        }
    }
};
$.extend = function (target) {
    $.each(_slice(arguments, 0), function (obj) {
        if (obj == null) return;
        $.each(obj, function (value, key) {
            if (target[key] !== undefined) return;
            if (_isObject(value) && value.nodeType == null) $.extend(target[key], value);
            else target[key] = value;
        });
    });
    return target;
};


$.fn = {
    jquery: 'ASJqLite 1.0',
    each: function (iterator) {
        $.each(this, function (el, i) {
            iterator.call(el, i, el, this);
        }, this);
        return this;
    },
    eq: function (index) {
        if (index < 0) index = this.length + index;
        if (index < 0 || index >= this.length) return $([]);
        return $(this[index]);
    }
};

$.extend(ASJqLite.prototype, $.fn);