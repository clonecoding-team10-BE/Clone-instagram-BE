const express = require('express')
const authMiddleware = require("../middlewares/auth-middleware.js")
const PostController = require("../controllers/post.controller.js")
const postcontroller = new PostController();
const router = express.Router()

//게시글 작성
//localhost:3000/posts POST
router.post("/", authMiddleware, postcontroller.CreatePost)

//게시글 전체 조회
//localhost:3000/posts GET
router.get("/", authMiddleware,postcontroller.getPost)

// 게시글 수정 
//localhost:3000/posts/:postId PUT
router.put('/:postId', authMiddleware,postcontroller.modifyPost);

// 게시글 삭제
//localhost:3000/posts/:postId DELETE
router.delete('/:postId', authMiddleware,postcontroller.deletePost);

module.exports = router;

