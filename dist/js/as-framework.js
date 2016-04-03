(function (window, undefined) {'use strict';
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
    //
    // BUILD AS-JqLite:
    
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
    
    ASJqLite.prototype = $.extend($.fn, {
        // config
        jquery: 'ASJqLite',
        version: '1.0.0'
        
    });
    
    var hasAddEventListener = _isFunction(document.addEventListener);
    
    function globalEventHandler(evt) {
        var currentTarget = evt.currentTarget;
        var handlers = currentTarget._events[evt.type];
        $.each(handlers, function (handler) {
            handler.call(currentTarget, evt);
        });
    }
    
    $.extend($.fn, {
        on: function (eventType, selector, handler) {
            if (eventType === 'ready') eventType = 'DOMContentLoaded';
            if (_isFunction(selector)) {
                handler = selector;
                selector = null;
            }
            return this.each(function () {
                if (this._events == null) this._events = {};
                if (this._events[eventType] != null) {
                    this._events[eventType].push(handler);
                    return;
                }
                this._events[eventType] = [handler];
                if (hasAddEventListener) {
                    this.addEventListener(eventType, globalEventHandler, false);
                } else {
                    this.attachEvent('on' + eventType, globalEventHandler)
                }
            });
        },
        off: function (eventType, callback) {
            return this.each(function () {
                if (!this._events || !this._events[eventType]) return;
                if (_isFunction(callback)) {
                    var index = this._events[eventType].indexOf(callback);
                    this._events[eventType].splice(index, 1);
                } else if (callback == null) {
                    this._events[eventType] = [];
                    if (hasAddEventListener) {
                        this.removeEventListener(eventType, globalEventHandler, false);
                    } else {
                        this.detachEvent('on' + eventType, globalEventHandler);
                    }
                }
            });
        }
    });
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
    //
    // BUILD AS-Framework:
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
            console.error('That ' + alias + ' already used');
            return;
        }
        _classes[alias] = _Class;
        _default[alias] = config;
    };
    
    var _classes = {};
    var _default = {};
    AS.config = {};
    FixedItem.alias = 'fixed';
    function FixedItem($el, config) {
        this.config = config;
        this.$wrapper = $el;
    }
    
    $.extend(FixedItem.prototype, {
        onScroll: function () {
            if (!this.config.scrollX) return;
            this.$wrapper.css('left', -window.pageXOffset + 'px');
            this.$wrapper.setClass({
                'as-fixed': window.pageYOffset >= this.config.scrollTop
            });
        }
    });
    
    AS.setDefaultSettings(FixedItem, {
        scrollX: false,
        scrollTop: 0
    });
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

    window.$ = $;
    window.AS = AS;

}(this));