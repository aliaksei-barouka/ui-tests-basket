const {test, expect, chromium} = require('@playwright/test');
const {allure} = require('allure-playwright');
const LoginPage = require('../pages/login.page');
const {HomePage} = require('../pages/home.page');


test.describe('basket testing', () => {
    let browser;
    let context;
    let page;
    let loginPage;
    let homePage;


    test.beforeEach(async ({}, testInfo) => {
        browser = await chromium.launch({headless: false});
        context = await browser.newContext();
        page = await context.newPage();
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        await loginPage.goToLoginPage();
        await loginPage.loginToSite('test', 'test');
        await homePage.basket.checkBasketCounterValueIsEmpty();
        if (testInfo.title === 'Add all items to basket and open it') {
            await homePage.buyFirstItemWithDiscount();
        }
    });
    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === "failed") {
            const screenshot = await page.screenshot({fullPage: true});
            await allure.attachment('failed_screen', screenshot, 'image/png');
        }
        await browser.close();
    });
    test.only('Check basket is opened new', async () => {
        await homePage.openBasketDropdownButton();
        //  Check basket is opened
        await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();
    });
    test('Add 9 same items with discount to basket and open it', async () => {

        const productsWithDiscount = await page.locator("//span[@class='product_discount']//ancestor::div[@class='note-item card h-100 hasDiscount']");
        console.log(await productsWithDiscount.all());
        if ((await productsWithDiscount.all()).length > 0) {
            const buyButtonOfProductWithDiscount = await productsWithDiscount.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0);
            for (let i = 0; i < 9; i++) {
                await page.waitForSelector(`//span[@class="basket-count-items badge badge-primary" and text()="${i}"]`, {timeout: 1000});
                await buyButtonOfProductWithDiscount.click();
                console.log(`${i} interation(s)`);
            }
            await page.waitForSelector(`//span[@class="basket-count-items badge badge-primary" and text()="9"]`, {timeout: 1000});
            const basketCounter = await page.locator("//span[@class='basket-count-items badge badge-primary']").textContent();
            await expect(basketCounter).toMatch('9');
            console.log(`${basketCounter} item(s) with discount is located in basket`);
            // Check basket is opened
            await page.locator("//a[@id='dropdownBasket']").click();
            //Check dropdown items
            const dropDownItems = await page.locator("//li[@class='basket-item list-group-item d-flex justify-content-start align-items-center']");
            const itemsName = await ((await dropDownItems).locator("//span[@class='basket-item-title']")).textContent();
            console.log(`Item Name: ${itemsName}`);
            const itemsPrice = await ((await dropDownItems).locator("//span[@class='basket-item-price']")).textContent();
            console.log(`Item Price: ${itemsPrice}`);
            const totalPrice = await page.locator("//span[@class='basket_price']").textContent();
            console.log(`Total Price: ${totalPrice}`);
            await expect(itemsName).toBeTruthy() && await expect(itemsPrice).toBeTruthy() && await expect(totalPrice).toBeTruthy();
            await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
            const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
            await expect(page).toHaveURL(expectedBasketURL);
            const errorState = await page.locator("//div[@class='site-error']");
            await expect(errorState).toBeEmpty();
        } else {
            console.log('No items with discount were found')
        }
    });


});