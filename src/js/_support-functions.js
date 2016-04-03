function _slice(obj, start, end) { return Array.prototype.slice.call(obj, start, end); }
function _isLikeArray(obj) { return Object.prototype.toString.call(obj) === '[object Array]' || (_isObject(obj) && obj.length != null); }
function _isObject(obj) { return typeof obj === 'object'; }
function _isFunction(obj) { return typeof obj === 'function'; }
function _isString(obj) { return typeof obj === 'string'; }

function _toCamelCase(string) {
    return string.replace(/\-\w/ig, function (m) {
        return m.slice(1).toUpperCase();
    });
}