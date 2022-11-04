const mongoose = require('mongoose')
const request = require('supertest')
const { connect } = require('./database')
const User = require('../models/userSchema')
const app = require('../index');
const {hashPassword} = require('../middleware/pwdAuth')

describe('Auth: User', () => {
    let conn;
    
    beforeAll(async () => {
        conn = await connect()       
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should signup a user', async () => {
        const response = await request(app).post('/users/signup')
        .set('content-type', 'application/json')
        .send({ 
            password: 'Password123', 
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobi@mail.com'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('firstname', 'tobie')
        expect(response.body.user).toHaveProperty('lastname', 'Augustina')
        expect(response.body.user).toHaveProperty('email', 'tobi@mail.com')        
    })


    it('successful login:Correct details', async () => {
      // create user in out db
      const newUser = {
        email: "tobi@gmail.com",
        password: "123456",
        firstname: "Tobi",
        lastname: "babatunde",
      };
      const hashedPassword = await hashPassword(newUser.password);
      newUser.password = hashedPassword;
      const user = await User.create(newUser);
      // login user
      const response = await request(app)
        .post("/users/login")
        .set("content-type", "application/json")
        .send({
          email: "tobi@gmail.com",
          password: "123456",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success");
      expect(response.body).toHaveProperty("token");
      expect(response.body.success).toBeTruthy()
    })

    it('failed login: Incorrect details', async () => {
        // create user in out db
        const newUser = {
          email: "tobi@gmail.com",
          password: "123456",
          firstname: "Tobi",
          lastname: "babatunde",
        };
        const hashedPassword = await hashPassword(newUser.password);
        newUser.password = hashedPassword;
        const user = await User.create(newUser);
        // login user
        const response = await request(app)
          .post("/users/login")
          .set("content-type", "application/json")
          .send({
            email: "tobi@gmail.co",
            password: "123456",
          });
  
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("success");
        expect(response.body).toHaveProperty("message");
        expect(response.body.success).toBeFalsy()
        expect(response.body.message).toBe("invalid credential")
      }
      )
})