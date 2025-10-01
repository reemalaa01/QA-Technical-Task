API Tests Description

The API tests in this project are designed to validate the functionality of the backend endpoints of the application. Using Supertest and Mocha, these tests cover key scenarios including:

User registration and authentication

User detail retrieval, update, and deletion

Handling of invalid inputs and error responses

Verification of response structure and messages

The tests also include handling for known bugs using try/catch blocks to ensure that the CI/CD pipeline continues to run even when certain endpoints do not behave as documented.

The tests generate Mochawesome HTML and JSON reports, which include test results, and details of any known issues.