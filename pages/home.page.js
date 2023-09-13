const BasePage = require('./base.page');
const Basket = require('../modules/Basket')

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.basket = new Basket(page);

        // locators
        this.allProducts = "//div[@class='col-3 mb-5']";
        this.productsWithDiscount = "//span[@class='product_discount']//ancestor::div[@class='note-item card h-100 hasDiscount']";
        this.productsWithoutDiscount = "//span[@class='product_discount']//ancestor::div[@class='note-item card h-100']";
        this.buyButton = "//button[@class='actionBuyProduct btn btn-primary mt-3']";
    }

    async goToHomePage() {
        await super.navigate("");
    }

    // async loginToSite (loginValue, passwordValue){
    //     await this.page.type(this.login, loginValue);
    //     await this.page.type(this.password, passwordValue);
    //     await this.page.click(this.loginButton);
    // }
}

module.exports = {
    HomePage,
    Basket
};