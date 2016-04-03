var supportStyleForConfig = ['height', 'width'];

/**
 * @param {string=} selector
 * @return {ASJqLite}
 * */
function _find(selector) {
    return $(('.[').indexOf(selector[0]) > -1 ? selector : '[as-' + selector + '],[data-as-' + selector + ']');
}


/**
 * @param {object} element
 * @param {Array=} list - Список конфигураций из атрибута для элемента
 * @return {object} Просчитанный пользовательный объект конфигураций.
 * */
function _calculateConfig(element, list) {
    var obj = {};
    var computed = _getComputedStyle(element);
    $.each(list, function (item) {
        var parts = item.split(':');
        var name = _toCamelCase(parts[0]);
        var value = parts[1] || true;
        if (name[0] === '!') {
            obj[name.slice(1)] = false;
            return;
        }

        if (~supportStyleForConfig.indexOf(value)) {
            value = parseInt(_getStyle(element, value, computed));
        }
        obj[name] = value;
    });
    return obj;
}

/**
 * @param {object} element
 * @param {string=} classAlias
 * @return {object} Полный конфиг для элемента
 * */
function _getConfig(element, classAlias) {
    var _key;
    var attr = element.getAttribute(_key = ('as-' + classAlias)) || element.getAttribute(_key = ('data-as-' + classAlias));
    var configList = attr == null ? [] : attr.split(' ');
    element.setAttribute(_key, '');
    return $.extend(_calculateConfig(element, configList), AS.config[classAlias] || {}, _default[classAlias] || {});
}

/* ASClass */
ASClass.instance = null;
function ASClass() {
    if (ASClass.instance != null) return ASClass.instance;
    ASClass.instance = this;

    $.each(_classes, function (_Class) {
        var alias = _Class.alias;
        var list = this['$' + alias] = new ASList();
        _find(alias).each(function () {
            list.push(new _Class($(this), _getConfig(this, alias)));
        });
    }, this);
}

$.extend(ASClass.prototype, {
    /**
     * @description Перебирает каждый каждый привязанный класс
     * @param {function(int, object)} iterator - Перебирает каждый элемент в классе.
     * */
    each: function (iterator) {
        $.each(_classes, function (_Class) {
            AS(_Class.alias).each(iterator);
        });
    }
});


/* AS-List */
function ASList() {
    this.length = 0;
}

$.extend(ASList.prototype, {
    each: $.fn.each,
    push: function (value) {
        Array.prototype.push.call(this, value);
    }
});



function AS(selector) {
    var _as = new ASClass();
    if (selector && _as['$' + selector]) {
        return _as['$' + selector];
    }
    return _as;
}

AS.setDefaultSettings = function (_Class, config) {
    var alias = _Class.alias;
    if (_default[alias] != null) {
        console.error('That "' + alias + '" already used');
        return;
    }
    _classes[alias] = _Class;
    _default[alias] = config;
};

var _classes = {};
var _default = {};
AS.config = {};