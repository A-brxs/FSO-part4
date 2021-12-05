const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' }).end()
  }
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
  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  const blog = new Blog(request.body)
  blog.user = user._id

  let savedBlog = await blog.save()
  console.log(savedBlog)
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog)
})

blogsRouter.delete('/:id', async (request,response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' }).end()
  }
  if (!blog ) {
    return response.status(404).json({ error: 'blog id not found' }).end()
  }
  if ( blog.user.toString() === user.id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(200).end()
  } else {
    response.status(400).json({ error: 'invalid token' }).end()
  }

})

blogsRouter.put('/:id', async (request,response) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog.toJSON())
  // const body = request.body
  // if (!request.token || !request.user) {
  //   return response.status(401).json({ error: 'token missing or invalid' }).end()
  // }
  // const blog = {
  //   likes: body.likes
  // }
  // const opts = {
  //   runValidators: true, new: true
  // }
  // let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, opts )
  // response.status(200).json(updatedBlog)
})
module.exports = blogsRouter
