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
        await super.navigateTo("basket");
    }

    async checkPageErrorNotExists() {
        const error = this.page.locator(this.siteError);
        await expect(error).toBeEmpty();
    }
}
module.exports = BasketPage;