
# QA Automation Project

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/reemalaa01/QA-Technical-Task/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/reemalaa01/QA-Technical-Task/tree/main)

This repository contains the UI and API tests for QA Technical Task.

Project Overview

This project is a full testing framework that covers UI (end-to-end). It demonstrates how to build a structured, automated test suite for validating core functionalities of a web application at the user interface level and The API tests in this project are designed to validate the functionality of the backend endpoints of the application

The repository is organized into two main sections:

🔹 UI Tests (Nightwatch.js)
Purpose

The UI testing part focuses on validating the user-facing functionality of the application in a browser environment. Using Nightwatch.js with Chrome WebDriver, these tests ensure that the application’s critical workflows behave correctly from an end-user perspective.

Key Features

Built with Nightwatch.js, a popular end-to-end testing framework.

Runs automated browser tests in Google Chrome.

Covers search flows, navigation, and page validations.

Generates detailed HTML reports (stored in tests-output/nightwatch-html-report/index.html).

Designed to run both locally (with ChromeDriver) and in CI/CD pipelines (with Google Chrome installed in the container).

Example Scenarios

Search module functionality validation.

Verifying that all search results contain expected keywords.

Handling dynamic elements and page assertions.

🔹 API Tests (Mocha + Chai + Supertest)
Purpose

The API testing part focuses on validating the backend endpoints of the system by sending requests and verifying responses.

Key Features

Built with Mocha (test runner) and Chai (assertion library).

Uses Supertest for making HTTP requests.

Covers user authentication flows such as registration and login.

Includes both positive and negative test cases.

Generates report for deeper analysis:


report.html → descriptive report that includes the test case titles exactly as written, useful for tracking bug references (e.g., POST REQ.: should register a user successfully with name,email and password (BUG-NUM1)).

Example Scenarios

Registering a user with valid details.

Attempting to register with missing fields.

Logging in with valid and invalid credentials.

Ensuring proper status codes and response messages.



🔹 Reports & CI/CD Integration

Both test suites generate HTML reports with clear pass/fail outcomes.

The project is integrated with CircleCI (via .circleci/config.yml) to automatically run UI tests first then API tests 

Test reports are stored as artifacts for review after each pipeline run.