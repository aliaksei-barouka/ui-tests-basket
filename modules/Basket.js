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
        await dropDownItemsNames.textContent();
    }

    async getDropDownItemsPrices() {
        const dropDownItemsPrices = await this.page.locator(this.basketDropDownItems).locator(this.basketItemsPrice);
        await dropDownItemsPrices.textContent();
    }

    async getTotalPriceValue() {
        const totalPrice = await this.page.locator(this.basketTotalPrice);
        await totalPrice.textContent();
    }

    async checkThatDropDownItemsHaveAllAttributes() {
        await this.getDropDownItemsNames();
        await this.getDropDownItemsPrices();
        await this.getTotalPriceValue();
        //TODO: Check that checks below are working correctly
        await expect(this.getDropDownItemsNames()).toBeTruthy 
        && await expect(this.getDropDownItemsPrices()).toBeTruthy
        && await expect(this.getTotalPriceValue()).toBeTruthy
    }

    async checkAllDropDownItemsHaveAllAttributes() {
        await this.getDropDownItemsNames();
        await this.getDropDownItemsPrices();
        await this.getTotalPriceValue();

        (await this.getDropDownItemsNames()).forEach(
            await expect(this.getDropDownItemsNames().nth()).toBeTruthy()
            && await expect(this.getDropDownItemsNames().nth()).toBeTruthy()
        )

        (await this.getDropDownItemsPrices()).forEach(
            await expect(this.getDropDownItemsPrices().nth()).toBeTruthy()
            && await expect(this.getDropDownItemsPrices().nth()).toBeTruthy()
        )

        await expect(this.getTotalPriceValue()).toBeTruthy();
    }


}

module.exports = Basket;