const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const { Posts } = require('../models/posts');


router.put('/posts/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
// 게시글 수정 
  if (!content) {
    return res.status(410).json({ "errorMessage": "수정할 게시글을 입력해주세요." });
  }

  try {
    const post = await Posts.findByPk(postId); // findBuPk()는 sequelize에서 제공하는 메서드 PrimaryKey에 해당하는 값을 찾아 반환(postId값에 해당하는 게시물 조회)

    if (!post) {
      return res.status(404).json({ "errorMessage": "게시글이 존재하지 않습니다." });
    }

    if (post.userId !== req.user.userId) {
      return res.status(403).json({ "errorMessage": "게시글의 수정 권한이 존재하지 않습니다." });
    }

    post.content = content;
    await post.save();

    res.status(200).json({ "message": "게시글이 성공적으로 수정되었습니다." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버에러가 발생했습니다');
  }
});

// 게시글 삭제
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Posts.findByPk(postId);
  
      if (!post) {
        return res.status(404).json({ "errorMessage": "게시글이 존재하지 않습니다." });
      }
  
      if (post.userId !== req.user.userId) {
        return res.status(403).json({ "errorMessage": "게시글의 삭제 권한이 존재하지 않습니다." });
      }
  
      await post.destroy(); //delete도 사용가능 하나 destroy는 해당 레코드를 직접 삭제하는 메소드 sequelize에서는 destroy를 사용하는 것이 일반적(안전성)
  
      res.status(200).json({ "message": "게시글 삭제에 성공하였습니다." });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('서버에러가 발생했습니다');
    }
  });
  
  module.exports = router;

module.exports = router;
