const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// eslint-disable-next-line no-unused-vars
blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!body.title) {
    return response.status(400).json({
      error: 'Title Missing'
    })
  } else if (!body.url) {
    return response.status(400).json({
      error: 'URL Missing'
    })
  }
  const blog = new Blog(request.body)

  let savedBlog = await blog.save()
  response.status(201).json(savedBlog)

})

module.exports = blogsRouter
