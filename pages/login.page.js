const BasePage = require('./base.page');

class LoginPage extends BasePage {
    constructor(page){
        super(page);

        // locators
        this.login = "//input[@id='loginform-username']";
        this.password = "//input[@id='loginform-password']";
        this.loginButton = "//button[@type='submit']";
    }

    async navigate() {
        await super.navigate("login");
    }

    async loginToSite (loginValue, passwordValue){
        await this.page.type(this.login, loginValue);
        await this.page.type(this.password, passwordValue);
        await this.page.click(this.loginButton);
    }


}
module.exports = LoginPage;

