const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.listOfFiveBlogs
    .map(b => new Blog(b))
  const promiseArray = blogObjects.map(b => b.save())
  await Promise.all(promiseArray)
})

describe('BLOG API Tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verify there are five blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(5)
  })

  test('verify id field exists', async () => {
    const response = await api.get('/api/blogs')
    for (let blog in response.body) {
      expect(response.body[blog].id).toBeDefined()
    }
  })

  test('verify blog creation', async () => {
    const newBlog = {
      author: 'luis',
      title: 'test',
      url: 'google',
      likes: 999
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type',/application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.listOfFiveBlogs.length + 1)
  })

  test('verify default like to zero', async () => {
    const newBlog = {
      author: 'luis',
      title: 'test',
      url: 'zerolikes'
    }

    let res = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type',/application\/json/)

    expect(res.body.likes).toEqual(0)
  })

  test('verify 404 when creating incomplete blog', async () => {
    const newBlog = {
      author: 'luis',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type',/application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})