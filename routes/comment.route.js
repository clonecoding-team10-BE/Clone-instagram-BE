const express = require('express')
const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = require("../controllers/comment.controller.js");
const commentcontroller = new CommentController();
const router = express.Router()

// 댓글 작성 API 
//localhost:3000/posts/:postId/comments
router.post('/:postId/comments', authMiddleware, commentcontroller.createComment);

// 댓글 조회 API
//localhost:3000/posts/:postId/comments
router.get('/:postId/comments', authMiddleware, commentcontroller.getComment);

// 댓글 삭제 API 
//localhost:3000/posts/:postId/comments/:commentId
router.delete("/:postId/comments/:commentId", authMiddleware, commentcontroller.deleteComment); 

module.exports = router;