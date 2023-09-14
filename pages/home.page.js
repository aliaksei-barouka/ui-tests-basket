const BasePage = require('./base.page');
const Basket = require('../modules/Basket')
const {expect} = require("@playwright/test");

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.basket = new Basket(page);

        // locators
        this.allProducts = "//div[@class='col-3 mb-5']";
        this.productsWithDiscount = "//div[@class='note-item card h-100 hasDiscount']";
        this.productsWithoutDiscount = "//div[@class='note-item card h-100']";
        this.buyItemsButton = "//button[@class='actionBuyProduct btn btn-primary mt-3']";
    }

    async goToHomePage() {
        await super.navigate("");
    }

    async findAllItems() {
        const items = await this.page.locator(this.allProducts).all();
        if (await items.length > 0) {
            return items;
        }
    }

    async findFirstItemWithDiscount() {
        const itemsWithDiscount = await this.page.locator(this.allProducts).locator(this.productsWithDiscount);
        if ((await itemsWithDiscount.all()).length > 0) {
            return itemsWithDiscount.nth(0);
        }
    }

    async findFirstItemWithoutDiscount() {
        const itemsWithoutDiscount = await this.page.locator(this.allProducts).locator(this.productsWithoutDiscount);
        if ((await itemsWithoutDiscount.all()).length > 0) {
            return itemsWithoutDiscount.nth(0);
        }
    }

    async buyFirstItemWithDiscount() {
        const firstItemWithDiscount = await this.findFirstItemWithDiscount();
        const buyButton = await firstItemWithDiscount.locator(this.buyItemsButton);
        await buyButton.click();
        const basketCounter = await this.basket.checkBasketCounterValue();
        await expect(basketCounter).toMatch('1');
    }

    async buyFirstItemWithoutDiscount() {
        const firstItemWithoutDiscount = await this.findFirstItemWithoutDiscount();
        const buyButton = await firstItemWithoutDiscount.locator(this.buyItemsButton);
        await buyButton.click();
        const basketCounter = await this.basket.checkBasketCounterValue();
        await expect(basketCounter).toMatch('1');
    }

    async buyEachItemOneTime() {
        const allItems = await this.findAllItems();
        console.log(allItems.length)
        for (let i = 0; i < allItems.length; i++) {
            const item = allItems[i];
            const buyEachItemOneTime = await item.locator(this.buyItemsButton).nth(0);
            await buyEachItemOneTime.click();
            console.log(buyEachItemOneTime)
            const basketCounter = await this.basket.checkBasketCounterValue();
            await expect(basketCounter).toMatch('8');
        }
    }

    async buyFirstItemWithDiscountNineTimes() {
        const firstItemWithDiscount = await this.findFirstItemWithDiscount();
        for (let i = 0; i < 9; i++) {
            const selector = `//span[@class="basket-count-items badge badge-primary" and text()="${i}"]`;
            await this.page.waitForSelector(selector, {timeout: 1000});
            const buyFirstItemWithDiscountNineTimes = await firstItemWithDiscount.locator(this.buyItemsButton);
            await buyFirstItemWithDiscountNineTimes.click();
        }
        await this.page.waitForSelector(`//span[@class="basket-count-items badge badge-primary" and text()="9"]`, {timeout: 1000});
        const basketCounter = await this.basket.checkBasketCounterValue();
        await expect(basketCounter).toMatch('9');
    }


}

module.exports = {
    HomePage,
    Basket
};