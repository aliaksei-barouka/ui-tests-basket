
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
        const browser = new Browser();
        await browser.close();
    });
    test('Check basket is opened', async () => {
        await homePage.basket.openBasketDropdown();
        await homePage.basket.redirectToBasket();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();
    });
    test.only('Add first item without discount to basket and open it', async () => {
        await homePage.buyFirstItemWithoutDiscount()
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('1');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        await basketPage.checkPageError();

    });
    test('Add first item with discount to basket and open it', async () => {
        await homePage.buyFirstItemWithDiscount();
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('1');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        await basketPage.checkPageError();
    });
    test('Add all items to basket and open it', async () => {
        await homePage.buyEachItemOneTime();
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('9');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkAllDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        await basketPage.checkPageError();
    });
    test('Add 9 same items with discount to basket and open it', async () => {
        await homePage.buyFirstItemWithDiscountNineTimes();
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('9');
        await homePage.basket.openBasketDropdown()
        await homePage.basket.checkDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        await basketPage.checkPageError();
    });

});