class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigateTo(path) {
        await this.page.goto("https://enotes.pointschool.ru/" + path);
    }
}

module.exports = BasePage;