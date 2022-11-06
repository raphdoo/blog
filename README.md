# blog
This is an api for a blog app

---

## Requirements
1. User should be able to register 
2. User should be able to login with Passport using JWT and expires after one hour
3. Logged in and not logged in users should be able to get a list of published blogs created
4. Logged in and not logged in users should be able to to get a published blog
5. Logged in users should be able to create a blog.
6. When a blog is created, it is in draft state
7. The owner of the blog should be able to update the state of the blog to published
8. The owner of a blog should be able to edit the blog in draft or published state
9. The owner of the blog should be able to delete the blog in draft or published state
10. The owner of the blog should be able to get a list of their blogs. 
11. The endpoint should be paginated
12. It should be filterable by state
13. Blogs created should have title, description, tags, author, timestamp, state, read_count, reading_time and body.
14. The list of blogs endpoint that can be accessed by both logged in and not logged in users should be paginated, default it to 20 blogs per page. 
15. It should also be searchable by author, title and tags.
16. It should also be orderable by read_count, reading_time and timestamp
17. When a single blog is requested, the api should return the user information(the author) with the blog. The read_count of the blog too should be updated by 1
18. An algorithm for calculating the reading_time of the blog.
19. Write tests for all endpoints
---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env

---
## Base URL
- https://blogapp.cyclic.app/


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  username |  string |  optional |
|  firstname | string  |  required |
|  lastname  |  string |  required  |
|  email     | string  |  required |
|  password |   string |  required  |


### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  created_at |  date |  required |
|  title |   string |  required  |
|  description |  string |  optional |
|  body |   string |  required  |
|  state | string  |  required, default:'draft', enum: ['draft', 'published']|
|  tags     | array  |  optional |
|  read_Count     | Number  |  optional |
|  reading_time     | Number  |   |
|  author     | ref- User  |   |




## APIs
---

### Signup User

- Route: /users/signup
- Method: POST
- Body: 
```
{
  "email": "doe@example.com",
  "password": "Password1",
  "firstname": "jon",
  "lastname": "doe",
}
```

- Responses

Success
```
{
    message: 'Signup successful',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "firstname": "jon",
        "lastname": "doe",
        "username": 'doe@example.com",
    }
}
```
---
### Login User

- Route: /users/login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "username": 'doe@example.com",
}
```

- Responses

Success
```
{
    success: true,
    token: 'sjlkafjkldsfjsd'
}
```

---
### Create a Blog

- Route: /articles
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  article: {
  title: "The giants",
  description: "Fall of the champions",
  tags: "Story, fairy",
  body: "The story of a Jugu hero"
}
```

- Responses

Success
```
{
    created_at: Sun Nov 06 2022 08:35:00 GMT+0100,
    status: true,
    article: { 
       title: "The giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state: "draft",
       read_Count:0, reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
}
```
---
### Get All Published Blogs

- Route: /articles
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 0)
    - skip (default: 20)
    - order_by (default: created_at)
    - order (options: asc | desc, default: asc)
    - created_at
- Responses

Success
```
{
    status: true,
    article: [{ 
       title: "The giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state:"published"
       read_Count:0, reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
  }]
}
```
---

### Get All Blogs for a User
- Route: /articles/user/:userID
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params:
    - page (default: 0)
    - skip (default: 20)
    - order_by (default: created_at)
    - state (default: published)
- Responses

Success
```
{
    status: true,
    article: [{ 
       title: "The giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state:"published"
       read_Count:0, reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
  }]
}
```
---

### Get a blog
- Route: /articles/:articleID
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    status: true,
    article: { 
       title: "The giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state:'published'
       read_Count:0, 
       reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
  }
}
```
---
### Update a blog

- Route: /articles/articleID
- Method: PUT
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  title: "The updated giants",
}
```

- Responses

Success
```
{
    created_at: Sun Nov 06 2022 08:35:00 GMT+0100,
    status: true,
    article: { 
       title: "The updated giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state: "draft",
       read_Count:0, reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
}
```
---

### Update the state

- Route: /articles/articleID
- Method: PATCH
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  state: "published",
}
```

- Responses

Success
```
{
    created_at: Sun Nov 06 2022 08:35:00 GMT+0100,
    status: true,
    article: { 
       title: "The updated giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state: "published",
       read_Count:0, reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
}
```
---
### Delete a blog

- Route: /articles/:articleID
- Method: GET
- Header
    - Authorization: Bearer {token}
- Responses

Success
```
{
    msg: "article deleted successfully",
    article: { 
       title: "The updated giants", 
       description: "Fall of the champions", tags: ['Story', 'fairy'],
       body: "The story of a Jugu hero"},
       state: "published",
       read_Count:0, reading_time:1, 
       author:{
          email: "doe@example.com", 
          "password": "Password1", 
          "firstname": "jon", 
          "lastname": "doe", 
          "username": 'doe@example.com"}
      }
}
```
---


...

## Contributor
- Rapheal Ajiboye
