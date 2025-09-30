const request = require('supertest');
const { expect } = require('chai');
//const app = require("../node_modules/mock-user-auth/app"); // your app.js

const API = process.env.API || "http://127.0.0.1:3000";
describe('Mock User Auth API', () => {
  let token;

  beforeEach(async () => {
    // Optional: reset users.json
  });

  it('should register a user successfully', async () => {
   // const uniqueEmail = `user${Date.now()}@test.com`;
    const res = await request(API)
      .post('/api/v1/users')
      .send({ name: 'user', email: 'user@gmail.com', password: 'user123' });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'User registered with success');
    // expect(res.body).to.have.property('token');
    // token = res.body.token;
  });
it("should login a user and return a token", async () => {
    const res = await request(API)
      
      .post("/api/v1/auth")
      .send({ email: "user@gmail.com", password: "user123" });

    expect(res.status).to.equal(200);// or 201 if your API uses it
    expect(res.body).to.have.property("token");
    expect(res.body.token).to.be.a("string");

    // Optional: save token for future authenticated requests
    token = res.body.token;
  });
 it('should get user details', async () => {
  const res = await request(API)
    .get('/api/v1/users')
    .set('Authorization', token); // make sure you include "Bearer "

  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('id');
  expect(res.body).to.have.property('name', 'user');
  expect(res.body).to.have.property('email', 'user@gmail.com');
  expect(res.body).to.have.property('password', 'user123');
  expect(res.body).to.have.property('imageUrl');
});

it('should update user details', async () => {
    const updatedData = {
      name: "newName",
      email: "new_email@gmail.com",
      password: "newpassword123"
    };

    const res = await request(API)
      .patch('/api/v1/users')
      .set('Authorization', token)
      .send(updatedData);

    expect(res.status).to.equal(200);
    //expect(res.body).to.have.property('data');
    expect(res.body).to.have.property('message', 'User updated with success!');

    const user = res.body.data;
    expect(user).to.have.property('id'); // id remains
    expect(user).to.have.property('name', updatedData.name);
    expect(user).to.have.property('email', updatedData.email);
    expect(user).to.have.property('password', updatedData.password);
    expect(user).to.have.property('imageUrl'); // unchanged
  });
  it("should login a user and return a token", async () => {
    const res = await request(API)
      
      .post("/api/v1/auth")
      .send({ email: "new_email@gmail.com", password: "newpassword123" });

    expect(res.status).to.equal(200);// or 201 if your API uses it
    expect(res.body).to.have.property("token");
    expect(res.body.token).to.be.a("string");

    // Optional: save token for future authenticated requests
    token = res.body.token;
  });
it('should delete the user successfully', async () => {
  const res = await request(API)
    .delete('/api/v1/users')
    .set('Authorization', token); // token from login

  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('message', 'User deleted with success!');
});
it('should delete all users successfully', async () => {
  const res = await request(API)
    .delete('/api/v1/all-users')
    .send({ key_admin: 'keyadmin123' }); // admin key in body

  expect(res.status).to.equal(200);
  expect(res.body).to.have.property('message', 'Users deleted with success');
});
// it('should fail to register user with invalid body', async () => {
//   const res = await request(API)
//     .post('/api/v1/users')
//     .send({ name: '', email: 'not-an-email' }); // missing password

//   expect(res.status).to.equal(401); // or whatever your API returns
//   expect(res.body).to.have.property('message');
// });
// it('should fail to register user without anything except name with space as a parameter', async () => {
//   const res = await request(API)
//     .post('/api/v1/users')
//     .send({ name:' '}); // missing password

//   expect(res.status).to.equal(401); // or whatever your API returns
//   expect(res.body).to.have.property('message');
// });
// it('should fail to login with email only ', async () => {
//   const res = await request(API)
//     .post('/api/v1/auth')
//     .send({ email: 'not-an-email'});

//   expect(res.status).to.equal(401);
//   expect(res.body).to.have.property('message');
// });
it('should fail to login with invalid credentials', async () => {
  const res = await request(API)
    .post('/api/v1/auth')
    .send({ email: 'wrong@gmail.com', password: 'wrongpass' });

  expect(res.status).to.equal(401);
  expect(res.body).to.have.property('message', 'Incorrect email or password');
});
it('should fail to login without inputs', async () => {
  const res = await request(API)
    .post('/api/v1/auth')
    .send({ email: ' ' });

  expect(res.status).to.equal(401);
  expect(res.body).to.have.property('message', 'Incorrect email or password');
});
it('should fail to get user details with invalid token', async () => {
  const res = await request(API)
    .get('/api/v1/users')
    .set('Authorization', 'Bearer invalidtoken');

  expect(res.status).to.equal(403);
  expect(res.body).to.have.property('message', 'Unauthorized');
});
it('should fail to update user with invalid token', async () => {
  const res = await request(API)
    .patch('/api/v1/users')
    .set('Authorization', 'Bearer invalidtoken')
    .send({ name: 'test' });

  expect(res.status).to.equal(403);
 // expect(res.body).to.have.property('message', 'Unauthorized');
});
it('should fail to update user with invalid body', async () => {
  const res = await request(API)
    .patch('/api/v1/users')
    .set('Authorization', token)
    .send({ email: '' }); // empty email

  expect(res.status).to.equal(403); // or 400 depending on API
 // expect(res.body).to.have.property('message');
});
it('should fail to delete user with invalid token', async () => {
  const res = await request(API)
    .delete('/api/v1/users')
    .set('Authorization', 'Bearer invalidtoken');

  expect(res.status).to.equal(403);
  expect(res.body).to.have.property('message', 'Unauthorized to delete');
});

it('should fail to delete all users with wrong admin key', async () => {
  const res = await request(API)
    .delete('/api/v1/all-users')
    .send({ key_admin: 'wrongkey' });

  expect(res.status).to.equal(403);
  expect(res.body).to.have.property('message', 'Unauthorized access');
});

});




// const request = require('supertest');
// const { expect } = require('chai');
// const API = "http://localhost:3000";

// describe('Mock User Auth API', () => {
//   let token;
//   const user = {
//     name: 'user',
//     email: 'user@gmail.com',
//     password: 'user123'
//   };
//   const updatedUser = {
//     name: 'newName',
//     email: 'new_email@gmail.com',
//     password: 'newpassword123'
//   };

//   // Register user before all tests and check response
//   before(async () => {
//     const res = await request(API)
//       .post('/api/v1/users')
//       .send(user);

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property('message', 'User registered with success');
//     expect(res.body).to.have.property('token');
//     token = res.body.token; // Save token for other tests
//   });

//   // Clean up all users after tests and check response
//   after(async () => {
//     const res = await request(API)
//       .delete('/api/v1/all-users')
//       .send({ key_admin: 'keyadmin123' });

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property('message', 'Users deleted with success');
//   });

//   it('should login the user and return a token', async () => {
//     const res = await request(API)
//       .post("/api/v1/auth")
//       .send({ email: user.email, password: user.password });

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property("token");
//     expect(res.body.token).to.be.a("string");

//     token = res.body.token; // Optional: update token if needed
//   });

//   it('should get user details', async () => {
//     const res = await request(API)
//       .get('/api/v1/users')
//       .set('Authorization', token);

//     expect(res.status).to.equal(200);
//     expect(res.body).to.include({
//       name: user.name,
//       email: user.email,
//       password: user.password
//     });
//     expect(res.body).to.have.property('id');
//     expect(res.body).to.have.property('imageUrl');
//   });

//   it('should update user details', async () => {
//     const res = await request(API)
//       .patch('/api/v1/users')
//       .set('Authorization', token)
//       .send(updatedUser);

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property('data');
//     expect(res.body).to.have.property('message', 'User updated with success!');

//     const userData = res.body.data;
//     expect(userData).to.include(updatedUser);
//     expect(userData).to.have.property('id');
//     expect(userData).to.have.property('imageUrl');
//   });

//   it('should login with updated credentials and return a new token', async () => {
//     const res = await request(API)
//       .post("/api/v1/auth")
//       .send({ email: updatedUser.email, password: updatedUser.password });

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property("token");
//     expect(res.body.token).to.be.a("string");

//     token = res.body.token;
//   });

//   it('should delete the user successfully', async () => {
//     const res = await request(API)
//       .delete('/api/v1/users')
//       .set('Authorization', token);

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property('message', 'User deleted with success!');
//   });
// });
