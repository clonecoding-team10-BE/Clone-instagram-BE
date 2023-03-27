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
router.put('/:postId', authMiddleware,postcontroller.modifyPost);

// 게시글 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
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
router.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const post = await Posts.findByPk(postId);

    if (!post) {
      throw new CustomError("게시글이 존재하지 않습니다", 404)
    }
    if (post.userId !== userId) {
      throw new CustomError("게시글의 삭제 권한이 존재하지 않습니다", 403)
    }

    //delete도 사용가능 하나 destroy는 해당 레코드를 직접 삭제하는 메소드 sequelize에서는 destroy를 사용하는 것이 일반적(안전성)
    await post.destroy();

    res.status(200).json({ "message": "게시글 삭제에 성공하였습니다." });
  } catch (err) {
    next(err)
  }
});

module.exports = router;

