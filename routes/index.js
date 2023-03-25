const express = require('express')
const router = express.Router()

const postsRouter = require('./post.route.js') 
const signupRouter = require('./signup.route.js') 
const loginRouter = require('./login.route.js') 
const commentsRouter = require('./comment.route.js') 
const likesRouter = require('./like.route.js')


router.use('/posts',[postsRouter,commentsRouter,likesRouter])
router.use('/',[signupRouter,loginRouter])
router.get('/',async(req,res) => {
    res.status(200).json("안녕하세요! 인스타그램 클론코딩 10조입니다~")
})

module.exports = router;