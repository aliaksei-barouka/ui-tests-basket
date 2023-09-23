const {chromium} = require('@playwright/test');


class Browser {
    constructor() {
        if (!Browser.instance) {
            this.browser = null;
            Browser.instance = this;
        }
        return Browser.instance;
    }

    async initialize() {
        if (!this.browser) {
            this.browser = await chromium.launch();
            this.context = await this.browser.newContext();
            this.page = await this.context.newPage();
        }
        return this.page;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = Browser;