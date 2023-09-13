const LoginPage = require("../pages/login.page");

class User {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    async login() {
        await this.loginPage.navigate();
        await this.loginPage.loginToSite('test', 'test');
        await this.page.waitForNavigation();
    }

    async addToCart(productName) {
        // Добавление товара в корзину
        await this.page.goto('https://enotes.pointschool.ru/product/' + productName);
        await this.page.click('button.addToCartButton');
        // Добавьте проверку успешного добавления в корзину
    }

    async checkout() {
        // Оформление заказа
        await this.page.goto('https://enotes.pointschool.ru/checkout');
        await this.page.click('button.checkoutButton');
        // Добавьте проверку успешного оформления заказа
    }
}

module.exports = User;
