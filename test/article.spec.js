const request = require('supertest')
const { connect } = require('./database')
const app = require('../index');
const Article = require('../models/articleSchema');
const User = require('../models/userSchema')
const {hashPassword} = require('../middleware/pwdAuth')
const { readingTime } = require("../utils/readCount");


describe('Article Route', () => {
    let conn;
    let token;

    beforeAll(async () => {
        conn = await connect()

    })

    beforeEach(async () => {
        const newUser = {
            email: "tobi@gmail.com",
            password: "123456",
            firstname: "Tobi",
            lastname: "babatunde",
          };
          
          const hashedPassword = await hashPassword(newUser.password);
          newUser.password = hashedPassword;
          await User.create(newUser);

        const loginResponse = await request(app)
        .post('/users/login')
        .set('content-type', 'application/json')
        .send({ 
            email: 'tobi@gmail.com', 
            password: '123456'
        });

        token = loginResponse.body.token;
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('get all articles', async () => {
        // create order in our db
        let content1 = "quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"
        let content2 = "qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"

        await Article.create(
            {
                title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                tags: ["Anker1", "Soundcore1"],
                body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur",
                reading_time: readingTime(content1)
              }
          )
          await Article.create(
            
            {
                title: "sut aut facere repellat provident occaecati excepturi optio reprehenderit",
                tags: ["Anker2", "Soundcore2"],
                body: "qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur",
                reading_time: readingTime(content2)
              }
          )
    

        const response = await request(app)
        .get('/articles')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('articles')
        expect(response.body).toHaveProperty('limit', 20)
        expect(response.body).toHaveProperty('page', 1)
        expect(response.body).toHaveProperty('status', true)
        expect(response.body.articles.every(article => article.state === "published")).toBe(true)
        expect(response.body.articles.every(article => article.reading_time === readingTime(content2))).toBe(true)
    })

    it('get an articleID', async () => {
        // create order in our db
        let content1 = "quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"

          const article = await Article.create( 
            {
                title: "sut aut facere repellat provident occaecati excepturi optio reprehenderit",
                tags: ["Anker2", "Soundcore2"],
                body: "qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"
            }
          )
        await article.save() 
        const articleID = article._id.toString()
        const response = await request(app)
        .get(`/articles/${articleID}`)
        .set('content-type', 'application/json')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('article')
        expect(response.body.article.body).toBe("qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"
        )
    })

    it('create an article -> Not logged in user', async () => {
        // create order in our db
        const response = await request(app).post('/articles')
        .set('content-type', 'application/json')
        .send({ 
            title: 'title1', 
            description: 'description1',
            body: 'body1',
            tags: 'title, body, description'
        })

        expect(response.status).toBe(401)

    })

    it('create an article -> logged in user', async () => {
        // create order in our db
        
        const response = await request(app).post('/articles')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
            title: 'title1', 
            description: 'description1',
            body: 'body1',
            tags: 'title, body, description'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('article')
        expect(response.body).toHaveProperty('status', true)

    })

    it('Failed update of an articleID => not logged in user', async () => {
        // create order in our db
        let content1 = "quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"

          const article = await Article.create( 
            {
                title: "sut aut facere repellat provident occaecati excepturi optio reprehenderit",
                tags: ["Anker2", "Soundcore2"],
                body: "qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"
            }
          )
        await article.save() 
        const articleID = article._id.toString()
        const response = await request(app)
        .get(`/articles/${articleID}`)
        .set('content-type', 'application/json')
        .send({
            title:"new title"
        })

        expect(response.status).toBe(401)
        
    })

    it('Failed update of an articleID => invalid articleID', async () => {
        // create order in our db

          const article = await Article.create( 
            {
                title: "sut aut facere repellat provident occaecati excepturi optio reprehenderit",
                tags: ["Anker2", "Soundcore2"],
                body: "qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"
            }
          )
        await article.save() 
        const articleID = article._id.toString()
        const response = await request(app)
        .get(`/articles/987654329e`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title:"new title"
        })
    })

        it('Successfully update => valid articleID and authentication', async () => {
            // create order in our db
    
              const article = await Article.create( 
                {
                    title: "sut aut facere repellat provident occaecati excepturi optio reprehenderit",
                    tags: ["Anker2", "Soundcore2"],
                    body: "qui et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur expedita et quia et suscipit\nsuscipit recusandae consequuntur"
                }
              )
            await article.save() 
            const articleID = article._id.toString()
            const response = await request(app)
            .get(`/articles/${articleID}`)
            .set('content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title:"new title"
            })
    
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('article')
        expect(response.body.article.title).toBe('new title')
    })
    
    


    // it('should return orders with state 2', async () => {
    //     // create order in our db
    //     await OrderModel.create({
    //         state: 1,
    //         total_price: 900,
    //         created_at: moment().toDate(),
    //         items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
    //     })

    //     await OrderModel.create({
    //         state: 2,
    //         total_price: 900,
    //         created_at: moment().toDate(),
    //         items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
    //     })

    //     const response = await request(app)
    //     .get('/orders?state=2')
    //     .set('content-type', 'application/json')
    //     .set('Authorization', `Bearer ${token}`)

    //     expect(response.status).toBe(200)
    //     expect(response.body).toHaveProperty('orders')
    //     expect(response.body).toHaveProperty('status', true)
        // expect(response.body.orders.every(order => order.state === 2)).toBe(true)
    // })
});