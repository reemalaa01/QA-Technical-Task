
const data = require('./data/testdata'); 

describe('Contact Us Page Tests ', function () {

  beforeEach((browser) => {
    browser.page.contactUsPage().navigate();
  });

  

  after((browser) => {
    browser.end();
  });
  /************************************************************************************************************************************/

  /*Test 1: Verify all essential UI elements exist on Contact Us page
  //
  // Expected: All form fields, buttons, and headings should be visible*/
  it('Should verify all key form elements are visible', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .assert.visible('@subjectHeadingWrapper')
      .assert.visible('@email')
      .assert.visible('@orderRef')
      .assert.visible('@fileUploadVisible')
      .assert.visible('@message')
      .assert.visible('@sendButton')
      .assert.containsText('@subHeading', 'SEND A MESSAGE')
      .assert.containsText('@pageHeading', 'CUSTOMER SERVICE - CONTACT US');
  });
  /************************************************************************************************************************************/

  /*Test 2: Verify subject heading shows correct description
  //
  // Expected: Each subject shows proper descriptive text when selected*/
  it('Should display correct description when selecting subject heading', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      // Select Customer Service
      .click('@subjectHeading')
      .click('@subjectCustomerService')
      .waitForElementVisible('#desc_contact2', 5000)
      .assert.containsText('#desc_contact2', 'For any question about a product, an order')

      // Select Webmaster
      .click('@subjectHeading')
      .click('@subjectWebmaster')
      .waitForElementVisible('#desc_contact1', 5000)
      .assert.containsText('#desc_contact1', 'If a technical problem occurs on this website');
  });
  /************************************************************************************************************************************/

  /* Test 3: Submit with all fields empty
  //
  // Expected: Should return error "Invalid email address."*/
  it('Should not allow submission when all fields are empty', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .waitForElementVisible('@pageHeading', 5000)
      .submit()
      .assertErrorMessage(data.invalidEmailAddress);
  });
  /************************************************************************************************************************************/

  /* Test 4: Invalid email format
  //
  // Expected: Should show "Invalid email address."*/
  it('Should show error when invalid email is entered', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .setValue('@email', data.invalidEmail)
      .submit()
      .assertErrorMessage(data.invalidEmailAddress);
  });
  /************************************************************************************************************************************/

  /* Test 5: Empty message with valid email
  //
  // Expected: Should show "The message cannot be blank."*/
  it('Should show error when message field is empty with valid email', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .setValue('@email', data.validEmail)
      .submit()
      .assertErrorMessage(data.invalidMessage);
  });
  /************************************************************************************************************************************/
  /* Test 6: Missing subject heading

  // Expected: Should show "Please select a subject from the list provided."*/
  it('Should show error when subject heading is not selected', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .setValue('@email', data.validEmail)
      .setValue('@message', data.missingSubject)
      .submit()
      .assertErrorMessage(data.errorOfSubject);
  });


  /************************************************************************************************************************************/
  /* Test 7: Add all the mandatory field only which is email, message and select subject heading

  // Expected: Should show "Please select a subject from the list provided."*/
  it('Should submit message successfully when mandatory fields added', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .click('@subjectHeading')
      .click('@subjectCustomerService')
      .setValue('@email', data.validEmail)
      .setValue('@message', data.missingSubject)
      .submit()
      .assertSuccessMessage(data.successfullySent);
  });

  /************************************************************************************************************************************/
  /*Test 8: Message with only whitespace

  // Expected: Should show "The message cannot be blank."*/
  it.skip('Should show error when message contains only whitespace (BUG)', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .fillForm('2', data.validEmail, data.validOrderRef, data.whitespaceMessage)
      .submit()
      .assertErrorMessage(data.invalidMessage);
  });
  /************************************************************************************************************************************/

  /* Test 9: Valid submission
  //
  // Expected: Should show success message*/
  it('Should successfully submit when all fields are valid', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .fillForm('2', data.validEmail, data.validOrderRef, data.validMessage)
      .submit()
      .assertSuccessMessage(data.successfullySent);
  });
  /************************************************************************************************************************************/

  /* Test 10: Email looks valid but has extra characters
    //
    // Expected: Should show "Invalid email address."*/
  it.skip('Should show error when email looks like valid but has extra characters(BUG)', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .fillForm('2', data.weirdInvalidEmail, data.validOrderRef, data.validMessage)
      .submit()
      .waitForElementVisible('@errorAlert', 5000)
      .assert.containsText('@errorItem', 'Invalid email address.');
  });
  /************************************************************************************************************************************/
  /* Test 11: Max local-part email (64 chars before @)
  //
  // Expected: Should be accepted and show success*/
  it('Should accept max local-part length email (64 chars before @)', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .fillForm('2', data.longLocal, data.validOrderRef, data.validMessage)
      .submit()
      .assertSuccessMessage(data.successfullySent);
  });
  /************************************************************************************************************************************/

  /* Test 12–14: Other email variations
  //
  // Expected: All should succeed*/
  [
    { email: data.aliasEmail, caseName: "email with alias (+ sign)" },
    { email: data.uppercaseEmail, caseName: "email with uppercase letters" },
    { email: data.longLocal, caseName: "large message scenario" },
  ].forEach(({ email, caseName }) => {
    it(`Should accept ${caseName}`, function (browser) {
      const contactPage = browser.page.contactUsPage();
      contactPage
        .fillForm('2', email, data.validOrderRef, data.validMessage)
        .submit()
        .assertSuccessMessage(data.successfullySent);
    });
  });
  /************************************************************************************************************************************/

  /* Test 15: Large order reference
  //
  // Expected: Should still succeed*/
  it('Should successfully submit when order reference is too large', function (browser) {
    const contactPage = browser.page.contactUsPage();

    contactPage
      .fillForm('2', data.validEmail, data.longOrderRef, data.validMessage)
      .submit()
      .assertSuccessMessage(data.successfullySent);
  });
  /************************************************************************************************************************************/
  /* Test 16–17: Other Order Refrence variations
    //
    // Expected: All should succeed*/
  [
    { orderRef: data.alphabeticalOrderRef, caseName: "alphabetical order reference" },
    { orderRef: data.specialCharOrderRef, caseName: "order reference with special characters" },
  ].forEach(({ orderRef, caseName }) => {
    it(`Should accept ${caseName}`, function (browser) {
      const contactPage = browser.page.contactUsPage();

      contactPage
        .fillForm('2', data.validEmail, orderRef, data.validMessage)
        .submit()
        .assertSuccessMessage(data.successfullySent);
    });
  });
  /************************************************************************************************************************************/
  /* Test 18: Valid file upload
  //
  // Expected: Should succeed*/
  it('Should successfully submit with a valid file attached', function (browser) {
    const contactPage = browser.page.contactUsPage();
    const path = require('path');
    const filePath = path.resolve(__dirname, data.validFileName);

    contactPage
      .fillForm('2', data.validEmail, data.validOrderRef, data.validMessage)
      .attachFile(filePath)
      .submit()
      .assertSuccessMessage(data.successfullySent);
  });
  /************************************************************************************************************************************/

  /* Test 19: Invalid file type upload
  //
  // Expected: Should show "Bad file extension"*/
  it('Should show error for unsupported file type', function (browser) {
    const contactPage = browser.page.contactUsPage();
    const path = require('path');
    const badFile = path.resolve(__dirname, data.badFileName);

    contactPage
      .fillForm('2', data.validEmail, data.validOrderRef, data.validMessage)
      .attachFile(badFile)
      .submit()
      .assertErrorMessage(data.badExtension);
  });
  /************************************************************************************************************************************/
  /* Test 20: Replace invalid file by directly attaching valid file afterwards
  //
  // Expected: Should succeed after valid file is attached */
  it('Should succeed after replacing invalid file with valid file', function (browser) {
    const contactPage = browser.page.contactUsPage();
    const path = require('path');

    const badFile = path.resolve(__dirname, data.badFileName);
    const goodFile = path.resolve(__dirname, data.validFileName);

    contactPage
      .fillForm('2', data.validEmail, data.validOrderRef, data.validMessage)
      .attachFile(badFile)
      .attachFile(goodFile)
      .submit()
      .assertSuccessMessage(data.successfullySent);
  });
  /************************************************************************************************************************************/


});
