const express = require('express')
const router = express.Router()

const postsRouter = require('./post.route.js') 
const signupRouter = require('./signup.route.js') 
const loginRouter = require('./login.route.js') 
const commentsRouter = require('./comment.route.js') 
const likesRouter = require('./like.route.js')


router.use('/posts',[postsRouter,commentsRouter,likesRouter])
router.use('/',[signupRouter,loginRouter])

module.exports = router;