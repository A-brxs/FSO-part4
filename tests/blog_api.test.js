const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const blogObjects = helper.listOfFiveBlogs
    .map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save())

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  promiseArray.push(user.save())
  await Promise.all(promiseArray)
})

describe('BLOG API READ Tests', () => {
  test('blogs are returned as json', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })


    await api
      .get('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verify there are five blogs', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api.get('/api/blogs').set('Authorization', 'Bearer ' + rootToken.body.token)

    expect(response.body).toHaveLength(5)
  })

  test('verify id field exists', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    for (let blog in response.body) {
      expect(response.body[blog].id).toBeDefined()
    }
  })

})

describe('BLOG API CREATE Tests', () => {
  test('verify blog creation', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      author: 'luis',
      title: 'test',
      url: 'google',
      likes: 999
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)
    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
    expect(response.body).toHaveLength(6)
  })

  test('verify default like to zero', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      author: 'luis',
      title: 'test',
      url: 'zerolikes'
    }

    let res = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    expect(res.body.likes).toEqual(0)
  })

  test('verify 404 when creating incomplete blog', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      author: 'luis',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type',/application\/json/)
  })
})

describe('BLOG API UPDATE Tests', () => {
  test('verify blog like update', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      author: 'luis',
      title: 'test',
      url: 'google',
      likes: 999
    }
    const updatedBlog = {
      likes: 3333
    }

    let createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    expect(createdBlog.body.likes).toEqual(999)
    const createdBlogId = createdBlog.body.id

    let res = await api
      .put(`/api/blogs/${createdBlogId}`)
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    expect(res.body.likes).toEqual(3333)
  })
})

describe('BLOG API DELETE Tests', () => {
  test('verify blog deletion', async () => {
    const rootToken = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })

    const newBlog = {
      author: 'luis',
      title: 'test',
      url: 'google',
      likes: 999
    }

    let res = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type',/application\/json/)

    await api
      .delete(`/api/blogs/${res.body.id}`)
      .set('Authorization', 'Bearer ' + rootToken.body.token)
      .expect(200)
  })
})

afterAll(() => {
  mongoose.connection.close()
})