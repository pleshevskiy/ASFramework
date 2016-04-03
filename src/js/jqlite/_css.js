/*
* @param (
* */
function _getComputedStyle(el) {
    // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
    // IE throws on elements created in popups
    // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    var view = el.ownerDocument.defaultView;
    if ( !view || !view.opener ) {
        view = window;
    }
    return view.getComputedStyle(el);
}
function _getStyle(el, name, computed) {
    computed || (computed = _getComputedStyle(el));
    return el.style[name] || (computed ? computed.getPropertyValue(name) || computed[name] : undefined);

}
/* ---- */
$.extend($.fn, {
    css: function (name, value) {
        if (_isString(name) && value == null) {
            return _getStyle(this, _toCamelCase(name));
        }
        return this.each(function () {
            var style = this.style;
            var obj = {};
            if (_isString(name) && value != null && value === value) {
                obj[name] = value;
            } else if (_isObject(name)) {
                obj = name;
            }

            $.each(obj, function (_value, _name) {
                style[_toCamelCase(_name)] = _value != null ? _value + '' : '';
            });
        });
    }
});