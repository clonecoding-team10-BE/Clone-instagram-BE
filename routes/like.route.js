const express = require('express')
const router = express.Router()
const { Likes, Posts } = require('../models');
const authMiddleware = require("../middlewares/auth-middleware.js");

// 게시글 좋아요 업데이트 API
// localhost:3000/posts/:postId/like
router.put('/:postId/like', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;s
    const { userId } = res.locals.user; // 토큰을 검사하여 해당 회원 확인
    const isExistPost = await Posts.findByPk(postId); // 게시글 있는지 확인
    // 게시글 없을 때
    if (!isExistPost) {
      return res.status(404).json({ errorMessage: '게시글이 존재하지 않습니다.' });
    }

    // postId와 userId 검색
    const isLiked = await Likes.findOne({ where: { postId: postId, userId: userId } });
    // 좋아요 유무 따져서 좋아요가 없으면 좋아요 등록, 반대인 경우는 좋아요 취소
    if (!isLiked) {
      const likes = isExistPost.likecount + 1;
      await Likes.create(
        { postId: postId, userId: userId, isLike: true }
      );
      await Posts.update(
        { likecount: likes },
        { where: { postId: postId } }
      )
      return res.status(200).json({ message: '좋아요 등록에 성공하였습니다' });

    } else {
      const likes = isExistPost.likecount - 1;
      await Likes.destroy(
        { where: { postId: postId, userId: userId } }
      );
      await Posts.update(
        { likecount: likes },
        { where: { postId: postId } }
      )
      return res.status(200).json({ message: '좋아요 취소에 성공하였습니다.' });
    }
  } catch (error) {
    console.error(`${req.method} ${req.originalUrl} : ${error.message}`);
    return res.status(400).json({ errorMessage: '예기치 않은 오류가 발생하였습니다.' });
  }
});

module.exports = router;
