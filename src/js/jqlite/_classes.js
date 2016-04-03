/* SUPPORT FOR $.hasClass AND $.setClass */
function _getClassNames(element) {
    return element.className.split(' ');
}
function _hasClassName(elementOrList, className) {
    return (elementOrList.nodeType ? _getClassNames(elementOrList) : elementOrList).indexOf(className) > -1;
}
function _removeClassName(classNameList, className) {
    if (!_hasClassName(classNameList, className)) return;
    classNameList.splice(classNameList.indexOf(className), 1);
}
function _addClassName(classNameList, className) {
    if (_hasClassName(classNameList, className)) return;
    classNameList.push(className);
}

$.extend($.fn, {
    hasClass: function (className) {
        if (this.length === 0) return false;
        return _hasClassName(this[0], className);
    },
    setClass: function (classNamesObject) {
        return this.each(function () {
            var classNameList = _isString(classNamesObject) ? classNamesObject.split(' ') : classNamesObject;
            var _classNames = _getClassNames(this);

            $.each(classNameList, function (value, key) {
                if (_isString(key)) { // KEY is className
                    if (!value) _removeClassName(_classNames, key);
                    else _addClassName(_classNames, key);
                    return;
                }
                // VALUE is className
                if (value[0] === '!') _removeClassName(_classNames, value.splice(1));
                else _addClassName(_classNames, value);
            });
            this.className = _classNames.join(' ');
        });
    }
});