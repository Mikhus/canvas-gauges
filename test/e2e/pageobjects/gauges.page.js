const page = require('./page');

const gaugesPage = Object.create(page, {
    /**
     * define elements
     */
    customGauge: {
        get() {
            return browser.elements('canvas:first-child');
        }
    },

    defaultGauge: {
        get() {
            return browser.elements('canvas:last-child');
        }
    },

    /**
     * define or overwrite page methods
     */
    open: {
        value: function() {
            page.open.call(this, 'gauges');
        }
    }
});

module.exports = gaugesPage;
