const {expect} = require("@playwright/test");

class Basket {
    constructor(page) {
        this.page = page;

        // locators
        this.basketDropdownButton = "//a[@id='dropdownBasket']";
        this.basketCounter = "//span[@class='basket-count-items badge badge-primary']";
        this.basketDropDownItems = ".basket-item.list-group-item"
        this.basketItemsName = "//span[@class='basket-item-title']";
        this.basketItemsPrice = "//span[@class='basket-item-price']";
        this.basketTotalPrice = "//span[@class='basket_price']";
        this.goToBasketButton = "//a[@class='btn btn-primary btn-sm ml-auto']"
        this.clearItemsButton = "//a[@class='btn btn-danger btn-sm mr-auto']";

    }

    async openBasketDropdown() {
        const basketDropdownElement = this.page.locator(this.basketDropdownButton);
        await basketDropdownElement.click();
        const areaExpanded = await basketDropdownElement.getAttribute('aria-expanded');
        await expect(areaExpanded).toBe('true');
    }

    async clickClearItemsButton() {
        const clearItemsButtonElement = this.page.locator(this.clearItemsButton);
        await clearItemsButtonElement.click();
    }

    async getBasketCounterValue() {
        return await this.page.locator(this.basketCounter).textContent();
    }

    async emptyBasket() {
        const basketCounterValue = await this.getBasketCounterValue();
        if (basketCounterValue === '0') {
        } else {
            await this.openBasketDropdown();
            await this.clickClearItemsButton();
        }
    }

    async goToBasket() {
        const goToBasketButton = this.page.locator(this.goToBasketButton);
        await goToBasketButton.click();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(this.page).toHaveURL(expectedBasketURL);
    }

    async getDropDownItemsNames() {
        const dropDownItemsNames = await this.page.locator(this.basketDropDownItems).locator(this.basketItemsName);
        return await dropDownItemsNames;
    }

    async getDropDownItemsPrices() {
        const dropDownItemsPrices = await this.page.locator(this.basketDropDownItems).locator(this.basketItemsPrice);
        return await dropDownItemsPrices;
    }

    async getTotalPriceValue() {
        const totalPrice = await this.page.locator(this.basketTotalPrice);
        return await totalPrice;
    }

    async checkThatDropDownItemsHaveAllAttributes() {
        const names = await (await this.getDropDownItemsNames()).all();
        const prices = await (await this.getDropDownItemsPrices()).all();
        const totalPrice = await (await this.getTotalPriceValue()).all();

        for (const name of names) {
            const textName = await name.textContent();
            await expect(textName).toBeTruthy();
        }

        for (const price of prices) {
            const textPrice = await price.textContent();
            await expect(textPrice).toBeTruthy();
        }

        for (const price of totalPrice) {
            const textPrice = await price.textContent();
            await expect(textPrice).toBeTruthy();
        }
    }


}

module.exports = Basket;