const User = require('../models/user')

const listOfFiveBlogs = [
  {
    title: 'aaa',
    author: 'aaa',
    url: 'aaa',
    likes: 5
  },
  {
    title: 'bbb',
    author: 'bbb',
    url: 'bbb',
    likes: 10
  },
  {
    title: 'ccc',
    author: 'ccc',
    url: 'ccc',
    likes: 15
  },
  {
    title: 'ddd',
    author: 'ddd',
    url: 'ddd',
    likes: 8
  },
  {
    title: 'bbb',
    author: 'bbb',
    url: 'bbb',
    likes: 3
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  listOfFiveBlogs,
  usersInDb
}