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

AS.class.FixedItem = FixedItem;

AS.setDefaultSettings(FixedItem.alias, {
    scrollX: false,
    scrollTop: 0
});