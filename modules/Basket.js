class Basket {
    constructor(page) {
        this.page = page;

        // locators
        this.basketDropdownButton = "//a[@id='dropdownBasket']";
        this.basketCounter = "//span[@class='basket-count-items badge badge-primary']";
        this.basketItems = "//li[contains(@class, 'basket-item')]";
        this.basketItemsPrice = "//span[@class='basket_price']";
        this.redirectToBasket = "btn btn-primary btn-sm ml-auto"
        this.clearItemsButton = "//a[@class='btn btn-danger btn-sm mr-auto']";

    }

    async openBasketDropdownButton() {
        const basketDropdownElement = this.page.locator(this.basketDropdownButton);
        await basketDropdownElement.click();
    }
    async triggerClearItemsButton(){
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
            await this.openBasketDropdownButton();
            await this.triggerClearItemsButton();
        }
    }

}

module.exports = Basket;