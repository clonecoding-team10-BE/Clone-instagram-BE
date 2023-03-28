const express = require('express')
const authMiddleware = require("../middlewares/auth-middleware.js");
const LikeController = require("../controllers/like.controller.js")
const likecontroller = new LikeController();
const router = express.Router()

// 게시글 좋아요 업데이트 API
// localhost:3000/posts/:postId/like
router.put('/:postId/like', authMiddleware, likecontroller.updateLike);

module.exports = router;
