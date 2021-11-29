const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')
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

  const user = await User.findById(body.userId)
  const blog = new Blog(request.body)
  blog.user = user._id

  let savedBlog = await blog.save()
  console.log(savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request,response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(200).end()
})

blogsRouter.put('/:id', async (request,response) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }
  const opts = {
    runValidators: true, new: true
  }
  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, opts )
  response.status(200).json(updatedBlog)
})
module.exports = blogsRouter
