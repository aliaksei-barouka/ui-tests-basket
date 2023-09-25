
const {test, expect, chromium} = require('@playwright/test');
const {allure} = require('allure-playwright');
const LoginPage = require('../pages/login.page');
const {HomePage} = require('../pages/home.page');
const BasketPage = require('../pages/basket.page');
const Browser = require('../src/Browser');


test.describe('basket testing', () => {
    let browser;
    let page;
    let loginPage;
    let homePage;
    let basketPage;


    test.beforeEach(async ({}, testInfo) => {
        browser = new Browser(page);
        await browser.initialize();
        page = browser.page;
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        basketPage = new BasketPage(page);
        await loginPage.goToLoginPage();
        await loginPage.loginUser('test', 'test');
        await homePage.basket.emptyBasket();
        if (testInfo.title === 'Add all items to basket and open it') {
            await homePage.buyFirstItemWithDiscount();
        }
    });
    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === "failed") {
            const screenshot = await page.screenshot({fullPage: true});
            await allure.attachment('failed_screen', screenshot, 'image/png');
        }
        await browser.close()
    });
    test('Check basket is opened', async () => {
        await homePage.basket.openBasketDropdown();
        await homePage.basket.goToBasket();
        await basketPage.checkPageErrorNotExists();
    });
    test('Add first item W/O discount to basket and open it', async () => {
        await homePage.buyFirstItemWithoutDiscount()
        const basketCounterValue = await homePage.basket.getBasketCounterValue();
        await expect(basketCounterValue).toMatch('1');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkThatDropDownItemsHaveAllAttributes();
        await homePage.basket.goToBasket();
        await basketPage.checkPageErrorNotExists();

    });
    test('Add first item with discount to basket and open it', async () => {
        await homePage.buyFirstItemWithDiscount();
        const basketCounterValue = await homePage.basket.getBasketCounterValue();
        await expect(basketCounterValue).toMatch('1');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkThatDropDownItemsHaveAllAttributes();
        await homePage.basket.goToBasket();
        await basketPage.checkPageErrorNotExists();
    });
    test('Add all items to basket and open it', async () => {
        await homePage.buyEachItemOneTime();
        const basketCounterValue = await homePage.basket.getBasketCounterValue();
        await expect(basketCounterValue).toMatch('9');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkAllDropDownItemsHaveAllAttributes();
        await homePage.basket.goToBasket();
        await basketPage.checkPageErrorNotExists();
    });
    test('Add 9 same items with discount to basket and open it', async () => {
        await homePage.buyFirstItemWithDiscountMultipleTimes(9);
        const basketCounterValue = await homePage.basket.getBasketCounterValue();
        await expect(basketCounterValue).toMatch('9');
        await homePage.basket.openBasketDropdown()
        await homePage.basket.checkThatDropDownItemsHaveAllAttributes();
        await homePage.basket.goToBasket();
        await basketPage.checkPageErrorNotExists();
    });

});