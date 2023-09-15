const BasePage = require('./base.page');
const {expect} = require("@playwright/test");

class BasketPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        // locators
        this.siteError = "//div[@class='site-error']";
    }

    async goToBasketPage() {
        await super.navigate("basket");
    }

    async checkPageError() {
        const errorState = this.page.locator(this.siteError);
        await expect(errorState).toBeEmpty();
    }
}
module.exports = BasketPage;