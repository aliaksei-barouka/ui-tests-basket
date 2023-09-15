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
        browser = await chromium.launch();
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
    test('Check basket is opened', async () => {
        await homePage.basket.openBasketDropdown();
        await homePage.basket.redirectToBasket();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();
    });
    test('Add first item without discount to basket and open it', async () => {
        await homePage.buyFirstItemWithoutDiscount()
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('1');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();

    });
    test('Add first item with discount to basket and open it', async () => {
        await homePage.buyFirstItemWithDiscount();
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('1');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();
    });
    test('Add all items to basket and open it', async () => {
        await homePage.buyEachItemOneTime();
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('9');
        await homePage.basket.openBasketDropdown();
        await homePage.basket.checkAllDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket()
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();
    });
    test('Add 9 same items with discount to basket and open it', async () => {
        await homePage.buyFirstItemWithDiscountNineTimes();
        const basketCounterValue = await homePage.basket.checkBasketCounterValue();
        await expect(basketCounterValue).toMatch('9');
        await homePage.basket.openBasketDropdown()
        await homePage.basket.checkDropDownItemsHaveAllAttributes();
        await homePage.basket.redirectToBasket();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();

    });

});