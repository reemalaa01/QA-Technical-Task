module.exports = {
    url: 'http://automationpractice.multiformis.com/index.php?controller=contact',
  
    elements: {
      // Headers
      pageHeading: 'h1.page-heading',
      subHeading: 'h3.page-subheading',
  
      // Form fields
      subjectHeadingWrapper: 'div#uniform-id_contact',
      subjectHeading: 'select#id_contact',  // still needed for selecting values
      subjectCustomerService: 'select#id_contact option[value="2"]',
      subjectWebmaster: 'select#id_contact option[value="1"]',
      email: 'input#email',
      orderRef: 'input#id_order',
      message: 'textarea#message',
      fileUpload: 'input#fileUpload',
      fileUploadVisible: 'label[for="fileUpload"]',
      // Buttons
      sendButton: 'button#submitMessage',
  
      // Alerts
      errorAlert: 'div.alert.alert-danger',
      errorItem: 'div.alert.alert-danger li',
      successAlert: 'p.alert.alert-success',
    },
  
    commands: [{
      fillForm(subject, email, order, message) {
        if (subject === '2') {
            this.click('@subjectCustomerService');
          } else if (subject === '1') {
            this.click('@subjectWebmaster');
          }
        return this
          .setValue('@email', email)
          .setValue('@orderRef', order)
          .setValue('@message', message);
      },
      submit() {
        return this.click('@sendButton');
      },
      attachFile(filePath) {   
        return this.setValue('@fileUpload', filePath);
      },
      assertSuccessMessage(expected) {
      return this.waitForElementVisible('@successAlert', 5000)
                 .assert.containsText('@successAlert', expected);
    },

    assertErrorMessage(expected) {
      return this.waitForElementVisible('@errorAlert', 5000)
                 .assert.containsText('@errorItem', expected);
    }
    }]
  };
  