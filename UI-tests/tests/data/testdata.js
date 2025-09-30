module.exports = {
  // emails
  validEmail: 'test@example.com',
  invalidEmail: 'abc123',
  longLocal: 'a'.repeat(64) + '@example.com',   // 64 chars local-part
  aliasEmail: 'first+alias@example.com',
  uppercaseEmail: 'TEST@EXAMPLE.COM',
  whitespaceEmail: '   test@example.com   ',
  weirdInvalidEmail: 'reemalaa001@gmail.comvdbggerrr',

  // messages / other fields
  validMessage: 'This is a valid test message.',
  invalidEmailAddress: 'Invalid email address.',
  invalidMessage:'The message cannot be blank.',
  missingSubject:'This is a test without subject.',
  errorOfSubject:'Please select a subject from the list provided.',
  successfullySent:'Your message has been successfully sent',
  invalidEmailFormat:'Testing invalid email format.',
  badExtension: 'Bad file extension',
  whitespaceMessage: '   ',
  longMessage: '33333333333'.repeat(500),
  validOrderRef: '12345',
  longOrderRef: 'ORD'.repeat(500),

  // file names (example)
  validFileName: 'blefund_less1_ad_channels.png',
  badFileName: 'challenge1.o',
};
