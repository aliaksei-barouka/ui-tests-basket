import { allure } from "allure-playwright";

const { test, expect, chromium} = require('@playwright/test');

test.describe('basket testing', () => {
    let browser;
    let context;
    let page;

    test.beforeEach(async ({},testInfo) => {
        browser = await chromium.launch({headless: false});
        context = await browser.newContext();
        page = await context.newPage();
        //  Login
        await page.goto("https://enotes.pointschool.ru/login");
        await page.locator("//input[@id='loginform-username']").type('test');
        await page.locator("//input[@id='loginform-password']").type('test');
        await page.locator("//button[@type='submit']").click();
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
            console.log("Special condition is triggered")
            //Add item with discount to basket
            const productsWithDiscount = await page.locator("//span[@class='product_discount']//ancestor::div[@class='note-item card h-100 hasDiscount']");
            console.log(await productsWithDiscount.all());
            if ((await productsWithDiscount.all()).length > 0) {
                const buyButtonOfProductWithDiscount = await productsWithDiscount.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0).click();
                console.log('button is pressed');
            }
        }
    });
    test.afterEach(async () => {
         await browser.close();
     });
    test('Check basket is opened', async () => {
        //  Check dropdown is opened
        await page.locator("//a[@id='dropdownBasket']").click();
        const dropdownBasketIsOpened = page.locator("//div[@aria-labelledby='dropdownBasket']")

        await expect(dropdownBasketIsOpened).toHaveClass('dropdown-menu dropdown-menu-right show');
        //  Check basket is opened
        await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']")
        await expect(errorState).toBeEmpty();

    });
    test('Add first item without discount to basket and open it', async () => {

        const productsWithoutDiscount = await page.locator("//span[@class='product_discount']//ancestor::div[@class='note-item card h-100']")
        console.log((await productsWithoutDiscount.all()).length)
        if ((await productsWithoutDiscount.all()).length > 0) {
            const buyButtonOfProductWithoutDiscount = await productsWithoutDiscount.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0).click();
            const basketCounter = await page.locator("//span[@class='basket-count-items badge badge-primary']").textContent();
            await expect(basketCounter).toMatch('1');
            console.log(`${basketCounter} item(s) with discount is located in basket`);
            // Check basket is opened
            await page.locator("//a[@id='dropdownBasket']").click();
            //Check dropdown items
            const dropDownItems = await page.locator("//li[@class='basket-item list-group-item d-flex justify-content-start align-items-center']");
            const itemsName = await ((await dropDownItems).locator("//span[@class='basket-item-title']")).textContent()
            console.log(`Item Name: ${itemsName}`)
            const itemsPrice = await ((await dropDownItems).locator("//span[@class='basket-item-price']")).textContent()
            console.log(`Item Price: ${itemsPrice}`)
            const totalPrice = await page.locator("//span[@class='basket_price']").textContent()
            console.log(`Total Price: ${totalPrice}`)
            await expect(itemsName).toBeTruthy()
            && await expect(itemsPrice).toBeTruthy()
            && await expect(totalPrice).toBeTruthy()
            //  Check trasfer to basket is opened
            await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
            const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
            await expect(page).toHaveURL(expectedBasketURL);
            const errorState = await page.locator("//div[@class='site-error']")
            await expect(errorState).toBeEmpty();
        }
        else {
            console.log ('No items without discount were found')
        }
    });
    test('Add first item with discount to basket and open it', async () => {

        const productsWithDiscount = await page.locator("//span[@class='product_discount']//ancestor::div[@class='note-item card h-100 hasDiscount']")
        console.log (await productsWithDiscount.all())
        if ((await productsWithDiscount.all()).length > 0) {
            const buyButtonOfProductWithDiscount = await productsWithDiscount.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0).click();
            const basketCounter = await page.locator("//span[@class='basket-count-items badge badge-primary']").textContent();
            await expect(basketCounter).toMatch('1');
            console.log(`${basketCounter} item(s) with discount is located in basket`);
            // Check basket is opened
            await page.locator("//a[@id='dropdownBasket']").click();
            //Check dropdown items
            const dropDownItems = await page.locator("//li[@class='basket-item list-group-item d-flex justify-content-start align-items-center']");
            const itemsName = await ((await dropDownItems).locator("//span[@class='basket-item-title']")).textContent()
            console.log(`Item Name: ${itemsName}`)
            const itemsPrice = await ((await dropDownItems).locator("//span[@class='basket-item-price']")).textContent()
            console.log(`Item Price: ${itemsPrice}`)
            const totalPrice = await page.locator("//span[@class='basket_price']").textContent()
            console.log(`Total Price: ${totalPrice}`)
            await expect(itemsName).toBeTruthy()
            && await expect(itemsPrice).toBeTruthy()
            && await expect(totalPrice).toBeTruthy()
            await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
            const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
            await expect(page).toHaveURL(expectedBasketURL);
            const errorState = await page.locator("//div[@class='site-error']")
            await expect(errorState).toBeEmpty();
        }
        else {
            console.log ('No items with discount were found')
        }
    });
    test('Add all items to basket and open it', async () => {
        const allProducts = await page.locator("//div[@class='col-3 mb-5']")
        const products = await allProducts.all();
        console.log(allProducts.length);
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const buyButtonOfProductWithoutDiscount = await product.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0);
            await buyButtonOfProductWithoutDiscount.click();
            console.log(`Clicked on product ${i + 1}`);
        }
        const basketCounter = await page.locator("//span[@class='basket-count-items badge badge-primary']").textContent();
        await expect(basketCounter).toMatch('9');
        console.log(`${basketCounter} item(s) with discount is located in basket`);

        await page.pause()

        // Check basket is opened
        await page.locator("//a[@id='dropdownBasket']").click();
        //Check dropdown items
        const dropDownItems = await page.locator("//li[@class='basket-item list-group-item d-flex justify-content-start align-items-center']");
        const itemsName = await ((await dropDownItems).locator("//span[@class='basket-item-title']")).textContent()
        console.log(`Item Name: ${itemsName}`)
        const itemsPrice = await ((await dropDownItems).locator("//span[@class='basket-item-price']")).textContent()
        console.log(`Item Price: ${itemsPrice}`)
        const totalPrice = await page.locator("//span[@class='basket_price']").textContent()
        console.log(`Total Price: ${totalPrice}`)

        for (let i = 0; i < dropDownItems.length; i++) {
            await expect(itemsName.nth(i)).toBeTruthy() && await expect(itemsPrice.nth(i)).toBeTruthy();
        }
        await expect(totalPrice).toBeTruthy();
        //  Check trasfer to basket is opened
        await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
        const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
        await expect(page).toHaveURL(expectedBasketURL);
        const errorState = await page.locator("//div[@class='site-error']")
        await expect(errorState).toBeEmpty();
    });
    test('Add 9 items with discount to basket and open it', async () => {

        const productsWithDiscount = await page.locator("//span[@class='product_discount']//ancestor::div[@class='note-item card h-100 hasDiscount']")
        console.log (await productsWithDiscount.all())
        if ((await productsWithDiscount.all()).length > 0) {
            const buyButtonOfProductWithDiscount = await productsWithDiscount.locator("//button[@class='actionBuyProduct btn btn-primary mt-3']").nth(0);
            for (let i = 0; i<9 ; i++) {
                await page.waitForSelector(`//span[@class="basket-count-items badge badge-primary" and text()="${i}"]`, { timeout: 1000 });
                await buyButtonOfProductWithDiscount.click();
                console.log(`${i} interation(s)`);
            }
            await page.waitForSelector(`//span[@class="basket-count-items badge badge-primary" and text()="9"]`, { timeout: 1000 });
            const basketCounter = await page.locator("//span[@class='basket-count-items badge badge-primary']").textContent();
            await expect(basketCounter).toMatch('9');
            console.log(`${basketCounter} item(s) with discount is located in basket`);
            // Check basket is opened
            await page.locator("//a[@id='dropdownBasket']").click();
            //Check dropdown items
            const dropDownItems = await page.locator("//li[@class='basket-item list-group-item d-flex justify-content-start align-items-center']");
            const itemsName = await ((await dropDownItems).locator("//span[@class='basket-item-title']")).textContent()
            console.log(`Item Name: ${itemsName}`)
            const itemsPrice = await ((await dropDownItems).locator("//span[@class='basket-item-price']")).textContent()
            console.log(`Item Price: ${itemsPrice}`)
            const totalPrice = await page.locator("//span[@class='basket_price']").textContent()
            console.log(`Total Price: ${totalPrice}`)
            await expect(itemsName).toBeTruthy() && await expect(itemsPrice).toBeTruthy() && await expect(totalPrice).toBeTruthy()
            await page.locator("//a[@class='btn btn-primary btn-sm ml-auto']").click();
            const expectedBasketURL = 'https://enotes.pointschool.ru/basket';
            await expect(page).toHaveURL(expectedBasketURL);
            const errorState = await page.locator("//div[@class='site-error']")
            await expect(errorState).toBeEmpty();
        }
        else {
            console.log ('No items with discount were found')
        }
    });
});