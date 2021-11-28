const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const listWithThreeBlogs = [
    {
      _id: 'aaa',
      title: 'aaa',
      author: 'aaa',
      url: 'aaa',
      likes: 5,
      __v: 0
    },
    {
      _id: 'bbb',
      title: 'bbb',
      author: 'bbb',
      url: 'bbb',
      likes: 10,
      __v: 0
    },
    {
      _id: 'ccc',
      title: 'ccc',
      author: 'ccc',
      url: 'ccc',
      likes: 15,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  test('when list has three blogs, equals 30', () => {
    const result = listHelper.totalLikes(listWithThreeBlogs)
    expect(result).toBe(30)
  })
})

describe('favorite blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const favoritedOneBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5
  }
  const listWithFourBlogs = [
    {
      _id: 'aaa',
      title: 'aaa',
      author: 'aaa',
      url: 'aaa',
      likes: 5,
      __v: 0
    },
    {
      _id: 'bbb',
      title: 'bbb',
      author: 'bbb',
      url: 'bbb',
      likes: 10,
      __v: 0
    },
    {
      _id: 'ccc',
      title: 'ccc',
      author: 'ccc',
      url: 'ccc',
      likes: 15,
      __v: 0
    },
    {
      _id: 'ddd',
      title: 'ddd',
      author: 'ddd',
      url: 'ddd',
      likes: 8,
      __v: 0
    },
    {
      _id: 'bbb',
      title: 'ddd',
      author: 'ddd',
      url: 'ddd',
      likes: 3,
      __v: 0
    }
  ]
  const favoritedFourBlog = {
    title: 'ccc',
    author: 'ccc',
    likes: 15
  }

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.mostFavorited(listWithOneBlog)
    expect(result).toEqual(favoritedOneBlog)
  })
  test('when list has only more than one blog, equals the 15 blog list', () => {
    const result = listHelper.mostFavorited(listWithFourBlogs)
    expect(result).toEqual(favoritedFourBlog)
  })
})

