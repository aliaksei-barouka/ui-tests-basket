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
        this.redirectToBasketButton = "//a[@class='btn btn-primary btn-sm ml-auto']"
        this.clearItemsButton = "//a[@class='btn btn-danger btn-sm mr-auto']";

    }

    async openBasketDropdown() {
        const basketDropdownElement = this.page.locator(this.basketDropdownButton);
        await basketDropdownElement.click();
        const ariaExpanded = await basketDropdownElement.getAttribute('aria-expanded');
        await expect(ariaExpanded).toBe('true');
    }

    async triggerClearItemsButton() {
        const clearItemsButtonElement = this.page.locator(this.clearItemsButton);
        await clearItemsButtonElement.click();
    }

    async checkBasketCounterValue() {
        return await this.page.locator(this.basketCounter).textContent();
    }
    async checkBasketCounterValueIsEmpty() {
        const basketCounterValue = await this.checkBasketCounterValue();
        if (basketCounterValue === '0') {
        } else {
            await this.openBasketDropdown();
            await this.triggerClearItemsButton();
        }
    }
    async redirectToBasket() {
        const redirectToBasket = this.page.locator(this.redirectToBasketButton);
        await redirectToBasket.click();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(this.page).toHaveURL(expectedBasketURL);
    }

    async findDropDownItemsName() {
        const findDropDownItemsName = await this.page.locator(this.basketDropDownItems).locator(this.basketItemsName);
        await findDropDownItemsName.textContent();
    }

    async findDropDownItemsPrice() {
        const findDropDownItemsPrice = await this.page.locator(this.basketDropDownItems).locator(this.basketItemsPrice);
        await findDropDownItemsPrice.textContent();
    }

    async findTotalPrice() {
        const findTotalPrice = await this.page.locator(this.basketTotalPrice);
        await findTotalPrice.textContent();
    }

    async checkDropDownItemsHaveAllAttributes() {
        await this.findDropDownItemsName();
        await this.findDropDownItemsPrice();
        await this.findTotalPrice();
        await expect(this.findDropDownItemsName()).toBeTruthy && await expect(this.findDropDownItemsPrice()).toBeTruthy
        && await expect(this.findTotalPrice()).toBeTruthy
    }

    async checkAllDropDownItemsHaveAllAttributes() {
        await this.findDropDownItemsName();
        await this.findDropDownItemsPrice();
        await this.findTotalPrice();
        for (let i = 0; i < this.findDropDownItemsName().length; i++) {
            await expect(this.findDropDownItemsName().nth(i)).toBeTruthy() && await expect(this.findDropDownItemsName().nth(i)).toBeTruthy();
        }
        for (let i = 0; i < this.findDropDownItemsPrice().length; i++) {
            await expect(this.findDropDownItemsPrice().nth(i)).toBeTruthy() && await expect(this.findDropDownItemsPrice().nth(i)).toBeTruthy();
        }
        await expect(this.findTotalPrice()).toBeTruthy();
    }


}

module.exports = Basket;