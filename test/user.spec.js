const mongoose = require('mongoose')
const request = require('supertest')
const { connect } = require('./database')
const User = require('../models/userSchema')
const app = require('../index');

describe('Auth: Signup', () => {
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

    it('should signup a user', async (done) => {
        const response = await request(app).post('/users/signup')
        .set('content-type', 'application/json')
        .send({ 
            password: 'Password123', 
            firstname: 'tobie',
            lastname: 'Augustina',
            email: 'tobi@mail.com'
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('firstname', 'tobie')
        expect(response.body.user).toHaveProperty('lastname', 'Augustina')
        expect(response.body.user).toHaveProperty('email', 'tobi@mail.com')        
    })


//     it('should login a user', async () => {
//         // create user in out db
//         const user = await UserModel.create({ username: 'tobi', password: '123456'});

//         // login user
//         const response = await request(app)
//         .post('/login')
//         .set('content-type', 'application/json')
//         .send({ 
//             username: 'tobi', 
//             password: '123456'
//         });
    

//         expect(response.status).toBe(200)
//         expect(response.body).toHaveProperty('token')      
//     })
})