const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('validation of user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  const shortUsernameUser = {
    username: 'ml',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }
  const shortPasswordUser = {
    username: 'luis1',
    name: 'Matti Luukkainen',
    password: 'sa'
  }
  const noPasswordUser = {
    username: 'luis2',
    name: 'Matti Luukkainen'
  }
  const noUsernameUser = {
    name: 'Matti Luukkainen',
    password: 'salainen'
  }
  const repeatedUsername = {
    username: 'root',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  test('short user test', async () => {
    let req = await api
      .post('/api/users')
      .send(shortUsernameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(req.body.error).toMatch('shorter than the minimum allowed length')
  })
  test('short password test', async () => {
    let req = await api
      .post('/api/users')
      .send(shortPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(req.body.error).toMatch('Short password')
  })
  test('no user test', async () => {
    let req = await api
      .post('/api/users')
      .send(noUsernameUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(req.body.error).toMatch('Path `username` is required')
  })
  test('no password test', async () => {
    let req = await api
      .post('/api/users')
      .send(noPasswordUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(req.body.error).toMatch('Missing password')
  })
  test('repeated user test', async () => {
    let req = await api
      .post('/api/users')
      .send(repeatedUsername)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(req.body.error).toMatch('expected `username` to be unique')
  })
})

afterAll(() => {
  mongoose.connection.close()
})