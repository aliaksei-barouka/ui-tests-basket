const { test, expect, chromium} = require('@playwright/test');
const {allure} = require('allure-playwright');
const LoginPage = require('../pages/login.page');
const User = require('../actors/User')


test.describe('basket testing', () => {
    let browser;
    let context;
    let page;
    let user;

    test.beforeEach(async ({},testInfo) => {
        browser = await chromium.launch({headless:false});
        context = await browser.newContext();
        page = await context.newPage();
        user = new User(page);
        //  Login
        await user.login();
        const basketCounter = await page.locator("//span[@class='basket-count-items badge badge-primary']").textContent();
        if (basketCounter === '0') {
            console.log('Basket is empty');
        }
        else {
            await page.locator("//a[@id='dropdownBasket']").click();
            const dropdownBasketIsOpened = await page.locator("//a[@class='btn btn-danger btn-sm mr-auto']").click();
            console.log('Basket is cleaned successfully');
        }

        if (testInfo.title  ==='Add all items to basket and open it') {
            console.log("Special condition is triggered");
            //Add item with discount to basket
            const productsWithDiscount = await page.locator("//span[@class='product_discount']//ancestor::div[@class='note-item card h-100 hasDiscount']");
            console.log(await productsWithDiscount.all());
            if ((await productsWithDiscount.all()).length > 0) {
                const buyButtonOfProductWithDiscount = await productsWithDiscount.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0).click();
                console.log('button is pressed');
            }
        }
    });
    test.afterEach(async ({}, testInfo) => {
        if (testInfo.status === "failed") {
            const screenshot = await page.screenshot({ fullPage: true });
            await allure.attachment('failed_screen', screenshot, 'image/png');
        }
        await browser.close();
    });
    test.only('Check basket is opened new', async () => {
        //  Check dropdown is opened
        await page.locator("//a[@id='dropdownBasket']").click();
        const dropdownBasketIsOpened = page.locator("//div[@aria-labelledby='dropdownBasket']");
        await expect(dropdownBasketIsOpened).toHaveClass('dropdown-menu dropdown-menu-right show');
        //  Check basket is opened
        await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']");
        await expect(errorState).toBeEmpty();
    });


});