module.exports = {
  url: 'http://automationpractice.multiformis.com/',
  elements: {
    searchInput: 'input[name="search_query"]',
    searchButton: 'button[name="submit_search"]',
    resultHeader: 'span.lighter',
    productNames: '#product_list .product-name',
    productPrices: '.right-block .price',
    productSortDropdown: 'select#selectProductSort',
    optionNameAsc: 'select#selectProductSort option[value="name:asc"]',
    optionNameDesc: 'select#selectProductSort option[value="name:desc"]',
    productContainer: '#product_list',
    gridViewBtn: 'li#grid a',
    listViewBtn: 'li#list a',
    productAvailability: '#product_list .availability span',
    productLinks: '#product_list .product_img_link',
    addToCompareBtn: '.add_to_compare',
    compareCounter: '.total-compare-val',
    compareError: 'p.fancybox-error',
    outOfStockLabel: 'span.label-danger',
  addToCartDisabled: 'span.ajax_add_to_cart_button.disabled'
  },

  commands: [
    {
      searchFor(term) {
        return this
          .waitForElementVisible('@searchInput', 5000)
          .setValue('@searchInput', term)
          .click('@searchButton')
          .waitForElementVisible('@resultHeader', 5000);
      },
      sortBy(optionValue) {
        return this
          .click('@productSortDropdown') // open the dropdown
          .click(`select#selectProductSort option[value="${optionValue}"]`) // use raw CSS
          .pause(2000); // wait for sorting
      },
      switchToGrid() {
        return this
          .click('@gridViewBtn')
          .pause(1000);
      },

      switchToList() {
        return this
          .click('@listViewBtn')
          .pause(1000);
      },
      async getAvailabilityTexts(elementDef) {
        const browser = this.api;
        return new Promise((resolve, reject) => {
          browser.elements(elementDef.locateStrategy, elementDef.selector, function (res) {
            if (!res.value || res.value.length === 0) return resolve([]);

            const availabilityList = [];
            res.value.forEach((el) => {
              const elementId = el.ELEMENT || el['element-6066-11e4-a52e-4f735466cecf'];
              if (elementId) {
                browser.elementIdText(elementId, function (textRes) {
                  const text = textRes.value.trim();
                  availabilityList.push(text.toLowerCase() !== 'out of stock');
                  if (availabilityList.length === res.value.length) {
                    resolve(availabilityList);
                  }
                });
              }
            });
          });
        });
      },
      async getProductReferences(elementDef) {
        const browser = this.api;
        return new Promise((resolve, reject) => {
          browser.elements(elementDef.locateStrategy, elementDef.selector, function (res) {
            if (!res.value || res.value.length === 0) return resolve([]);

            const refs = [];
            let processed = 0;

            res.value.forEach((el, idx) => {
              const elementId = el.ELEMENT || el['element-6066-11e4-a52e-4f735466cecf'];

              if (elementId) {
                // click each product link to open details
                browser.elementIdClick(elementId, function () {
                  browser
                    .waitForElementVisible('#product_reference span[itemprop="sku"]', 5000)
                    .getText('#product_reference span[itemprop="sku"]', function (result) {
                      const refNumber = parseInt(result.value.replace('demo_', ''), 10);
                      refs[idx] = refNumber; // preserve order
                      processed++;

                      // go back to list
                      browser.back().pause(1000, function () {
                        if (processed === res.value.length) {
                          resolve(refs);
                        }
                      });
                    });
                });
              }
            });
          });
        });
      },

      async getProductPrices() {
        const browser = this.api;
        return new Promise((resolve) => {
          browser.elements('css selector', this.elements.productPrices.selector, function (res) {
            if (!res.value || res.value.length === 0) return resolve([]);
            const prices = [];
            res.value.forEach((el) => {
              const elementId = el.ELEMENT || el['element-6066-11e4-a52e-4f735466cecf'];
              browser.elementIdText(elementId, function (textRes) {
                prices.push(parseFloat(textRes.value.replace('$', '').trim()));
                if (prices.length === res.value.length) {
                  resolve(prices);
                }
              });
            });
          });
        });
      },
      async getProductTexts(selector) {
        const browser = this.api;
        return new Promise((resolve, reject) => {
          browser.elements('css selector', selector, function (res) {
            if (!res.value || res.value.length === 0) return resolve([]);
            const values = [];
            res.value.forEach((el, idx) => {
              const elementId = el.ELEMENT || el['element-6066-11e4-a52e-4f735466cecf'];
              browser.elementIdText(elementId, function (textRes) {
                values.push(textRes.value.trim());
                if (values.length === res.value.length) {
                  resolve(values);
                }
              });
            });
          });
        });
      },
      async assertSortedAscending(values, message = 'List should be sorted ascending') {
        for (let i = 0; i < values.length - 1; i++) {
          this.api.assert.ok(
            values[i] <= values[i + 1],
            `${message}. Found ${values[i]} > ${values[i + 1]}`
          );
        }
        return this;
      },

      async assertSortedDescending(values, message = 'List should be sorted descending') {
        for (let i = 0; i < values.length - 1; i++) {
          this.api.assert.ok(
            values[i] >= values[i + 1],
            `${message}. Found ${values[i]} < ${values[i + 1]}`
          );
        }
        return this;
      },

      async assertAllContain(values, keyword, message = 'All items should contain keyword') {
        values.forEach((val, idx) => {
          this.api.assert.ok(
            val.toLowerCase().includes(keyword.toLowerCase()),
            `${message}. Item ${idx + 1} was "${val}"`
          );
        });
        return this;
      }
    }
  ]
};
