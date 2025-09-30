const assert = require('assert');

describe('Search Module', function() {

  let searchPage;
  beforeEach((browser) => {
    searchPage = browser.page.searchPage();
    searchPage.navigate().searchFor('dress');
  });

  after(function(browser) {
    browser.end();
  });

  /* Test 1: Verify search header
  //
  // Expected: The result header should contain the word "DRESS"*/
  it('Should search for "dress" and show it in results header', function(browser) {
    searchPage.getText('@resultHeader', function(result) {
      const text = result.value;
      console.log('Result header:', text);
      assert(text.includes('DRESS'), 'Search result header does not contain "DRESS"');
    });
  });

  

  /*Test 5: Verify sort alphabetically A → Z
  //
  // Expected: Names should be sorted ascending alphabetically*/
  it('Should sort products alphabetically from A to Z', async function(browser) {
    await searchPage.sortBy('name:asc');
    const names = await searchPage.getProductTexts(searchPage.elements.productNames.selector);
    await searchPage.assertSortedAscending(
      names.map(n => n.toLowerCase()), 
      'Names should be sorted A → Z'
    );
  });

  /*Test 6: Verify sort alphabetically Z → A
  //
  // Expected: Names should be sorted descending alphabetically*/
  it('Should sort products alphabetically from Z to A', async function(browser) {
    await searchPage.sortBy('name:desc');
    const names = await searchPage.getProductTexts(searchPage.elements.productNames.selector);
    await searchPage.assertSortedDescending(
      names.map(n => n.toLowerCase()), 
      'Names should be sorted Z → A'
    );
  });

  /*Test 7: Verify switching product view (grid ↔ list)
  //
  // Expected: Default grid view → can switch to list view and back*/
  it('Should change product view from grid to list', async function(browser) {
    // Default should be grid
    browser.assert.cssClassPresent(searchPage.elements.productContainer.selector, 'grid');

    // Switch to grid explicitly
    await searchPage.switchToGrid();
    browser.assert.cssClassPresent(searchPage.elements.productContainer.selector, 'grid');
    browser.assert.cssClassNotPresent(searchPage.elements.productContainer.selector, 'list');

    // Switch to list
    await searchPage.switchToList();
    browser.assert.cssClassPresent(searchPage.elements.productContainer.selector, 'list');
    browser.assert.cssClassNotPresent(searchPage.elements.productContainer.selector, 'grid');
  });

  // ✅ Test 8: Verify sort by availability (in-stock first)
  // Expected: All in-stock products appear before any out-of-stock products
  it('Should sort products by availability (in stock first)', async function(browser) {
    await searchPage.sortBy('quantity:desc');
    const availabilityList = await searchPage.getAvailabilityTexts(searchPage.elements.productAvailability);
    console.log('Availability after sort:', availabilityList);

    let foundOutOfStock = false;
    for (let i = 0; i < availabilityList.length; i++) {
      if (!availabilityList[i]) {
        foundOutOfStock = true;
      } else if (availabilityList[i] && foundOutOfStock) {
        browser.assert.fail(
          `In-stock product found after an out-of-stock product at index ${i}`
        );
      }
    }
  });

 

  /* Test 11: Verify case-insensitive search
  //
  // Expected: Results for "dress", "Dress", "DRESS" should be identical*/
  it('Should return the same results regardless of case (dress vs Dress vs DRESS)', async function (browser) {
    await searchPage.navigate().searchFor('dress');
    const lowerCaseResults = await searchPage.getProductTexts('@productNames');

    await searchPage.navigate().searchFor('Dress');
    const capitalizedResults = await searchPage.getProductTexts('@productNames');

    await searchPage.navigate().searchFor('DRESS');
    const upperCaseResults = await searchPage.getProductTexts('@productNames');

    console.log('Lowercase results:', lowerCaseResults);
    console.log('Capitalized results:', capitalizedResults);
    console.log('Uppercase results:', upperCaseResults);

    browser.assert.deepStrictEqual(lowerCaseResults, capitalizedResults, 'Results for "dress" and "Dress" should match');
    browser.assert.deepStrictEqual(lowerCaseResults, upperCaseResults, 'Results for "dress" and "DRESS" should match');
  });

  /* Test 12: Verify product count text matches actual products
  //
  // Expected: Count in UI text matches actual number of products listed*/
  it('Should match product count text with actual number of products', async function (browser) {
    const countText = await searchPage.getText('.product-count');
    console.log('Product count text:', countText);

    const match = countText.match(/of\s+(\d+)\s+items/);
    browser.assert.ok(match, 'Product count text should contain "of X items"');
    const expectedCount = parseInt(match[1], 10);

    const products = await searchPage.getProductTexts('@productNames');
    const actualCount = products.length;
    console.log('Expected count:', expectedCount, 'Actual count:', actualCount);

    browser.assert.strictEqual(actualCount, expectedCount, `Expected ${expectedCount} products but found ${actualCount}`);
  });

  /*Test 13: Verify each product has a valid price
  //
  // Expected: Each price should contain $, follow money format, and match count of products*/
  it('Should ensure each product has a price with $ and count matches', function(browser) {
    searchPage.getProductPrices(function(priceList) {
      console.log('Collected prices:', priceList);

      const moneyRegex = /^\$\d+(?:\.\d{2})?$/;
      priceList.forEach((price, idx) => {
        browser.assert.ok(typeof price === 'string', `Price ${idx+1} should be a string`);
        browser.assert.ok(price.length > 0, `Product ${idx+1} price should not be empty`);
        browser.assert.ok(price.includes('$'), `Product ${idx+1} price should contain a $ sign`);
        browser.assert.ok(moneyRegex.test(price), `Product ${idx+1} price "${price}" should match format like $12 or $12.34`);
      });

      browser.elements('css selector', 'li.ajax_block_product', function(result) {
        const productCount = (result && result.value) ? result.value.length : 0;
        browser.assert.strictEqual(
          priceList.length,
          productCount,
          `Number of prices (${priceList.length}) should equal number of products (${productCount})`
        );
      });
    });
  });

});
