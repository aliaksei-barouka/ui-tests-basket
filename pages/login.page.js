const BasePage = require('./base.page');
const {expect} = require("@playwright/test");

class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        // locators
        this.login = "//input[@id='loginform-username']";
        this.password = "//input[@id='loginform-password']";
        this.loginButton = "//button[@type='submit']";
        this.loginTittle = "//div[@class='text-uppercase']";
    }

    async goToLoginPage() {
        await super.navigateTo("login");
    }
    async getUsername(){
        const titleElement = await this.page.locator(this.loginTittle);
        return await titleElement.textContent();
    }
    async loginUser(login, password) {
        await this.page.type(this.login, login);
        await this.page.type(this.password, password);
        await this.page.click(this.loginButton);
        const actualValue = await this.getUsername();
        await expect(actualValue).toContain(login);
    }


}

module.exports = LoginPage;

