This project contains end-to-end automated UI test cases for the demo e-commerce platform Automation Practice.

It is built using Nightwatch.js, following the Page Object Model (POM) for scalability and maintainability.

# Project Overview

The purpose of this project is to validate core functional flows of the e-commerce website

The tests simulate real user interactions like clicking buttons, entering inputs, file uploads, and asserting DOM changes.

# Tech Stack

Test Framework: Nightwatch.js

Language: JavaScript (Node.js)

Assertion Library: Built-in Nightwatch + Node.js assert

Page Object Pattern: Used for test reusability and cleaner structure

Reports: Nightwatch HTML Reporter

# Project Structure
📦 project-root
 ┣ 📂 tests
 ┃ ┣ contact.test.js      # Tests for Contact Us form
 ┃ ┣ dress.test.js        # Tests for Compare & Cart functionality
 ┃ ┣ search.test.js       # Tests for Search & Sorting
 ┃ ┗ ...
 ┣ 📂 page-objects
 ┃ ┣ contactUsPage.js     # Page Object for Contact Us
 ┃ ┣ searchPage.js        # Page Object for Search / Products
 ┃ ┗ ...
 ┣ 📂 tests-output        # Generated HTML reports
 ┣ nightwatch.conf.js     # Nightwatch configuration
 ┣ package.json           # Dependencies & scripts
 ┗ README.md              # Project description

# Features Covered


# Dress Module
Case-insensitive search validation (dress / Dress / DRESS → same results)

Product count text matches displayed products

Sorting by: price (asc/desc), name (asc/desc), availability, reference

Verify each product has a valid price format ($12.34)

Switch between grid and list views

Add to Cart button disabled for Out of Stock products

"Add to Compare" increments counter by 1

Clicking again decrements counter

Error message when exceeding max 3 products

and more test cases 

# Contact Us Module

Valid form submission with success message

Invalid email shows error message

Order reference validations

File upload: valid file, invalid file type, re-upload overwrite test

and more test cases 

# Running the Tests

Install dependencies

npm install


Run all tests

npx nightwatch


# Run a specific test suite

npx nightwatch tests/dress.test.js

# Run a specific test suite

npx nightwatch tests/contactus.test.js

# View HTML reports
Reports are generated in tests-output/nightwatch-html-report/