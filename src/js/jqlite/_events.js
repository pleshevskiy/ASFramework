
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