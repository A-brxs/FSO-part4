const dummy = () => {
  // ...
  return 1
}

const totalLikes = (blogs) => {

  const numberOfLikes =
    blogs
      .map( blog => {
        return (
          blog.likes)
      })
      .reduce( (sum,likes ) => {
        console.log('sum: ',sum,' likes: ',likes)
        return sum + likes
      },0)

  return numberOfLikes
}

const mostFavorited = (blogs) => {

  const favoriteBlog =
    blogs
      .reduce( (highest,blog ) => {
        console.log('highest: ',highest,' blog: ',blog)
        return highest.likes > blog.likes ? highest : blog
      })

  return ({
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  })
}

const mostBlogs = (blogs) => {
  const blogsPerAuthor =
    blogs
      .reduce( (bloggedAuthor,blog) => {
        bloggedAuthor[blog['author']]
        return bloggedAuthor
      }, {})

  return blogsPerAuthor
}

module.exports = {
  dummy,
  totalLikes,
  mostBlogs,
  mostFavorited
}