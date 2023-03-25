const express = require('express')
const { Posts, Likes, Users, Comments } = require("../models")
const authMiddleware = require("../middlewares/auth-middleware.js")
const router = express.Router()


//게시글 작성
//localhost:3000/posts POST
router.post("/", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { img, content } = req.body;
  await Posts.create({
    userId,
    img,
    content
  })
  res.status(200).json({ "message": "게시글 작성에 성공하였습니다." })
})

//게시글 전체 조회
//localhost:3000/posts GET
router.get("/", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  // const { userId } = req.body
  const posts = await Posts.findAll({
    raw: true,
    attributes: ["postId", "User.nickname", "img", "content", "likeCount", "createdAt", "updatedAt"],
    order: [['postId', 'DESC']], //최신순 정렬
    include: [{
      model: Users,
      attributes: []
    }]
  })

  //isLike가 존재하지않을때 -> 좋아요를 누르지 않았을 때
  //isLike 값을 강제로 false 반환
  const postList = await Promise.all(posts.map(async (post) => {
    const postId = post.postId
    //postId에 해당하는 comment도 같이 response
    const comments = await Comments.findAll({
      where: { postId },
      order: [['commentId', 'DESC']], //최신순 정렬
    })
    const likes = await Likes.findOne({
      where: { userId, postId }
    })
    // console.log(likes)
    if (!likes) {
      isLike = "false"
    } else {
      isLike = "true"
    }

    return {
      "postId": post.postId,
      "nickname": post.nickname,
      "img": post.img,
      "content": post.content,
      "likeCount": post.likeCount,
      "isLike": isLike,
      "createdAt": post.createdAt,
      "updatedAt": post.updatedAt,
      "comment": comments
    }
  }))

  res.status(200).json({ postList })
})

// 게시글 수정 
router.put('/:postId', authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(410).json({ "errorMessage": "수정할 게시글을 입력해주세요." });
  }

  try {
    const post = await Posts.findByPk(postId); // findBuPk()는 sequelize에서 제공하는 메서드 PrimaryKey에 해당하는 값을 찾아 반환(postId값에 해당하는 게시물 조회)

    if (!post) {
      return res.status(404).json({ "errorMessage": "게시글이 존재하지 않습니다." });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ "errorMessage": "게시글의 수정 권한이 존재하지 않습니다." });
    }
    //수정업데이트
    post.content = content;
    await post.save();

    res.status(200).json({ "message": "게시글이 성공적으로 수정되었습니다." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버에러가 발생했습니다');
  }
});

// 게시글 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  try {
    const post = await Posts.findByPk(postId);

    if (!post) {
      return res.status(404).json({ "errorMessage": "게시글이 존재하지 않습니다." });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ "errorMessage": "게시글의 삭제 권한이 존재하지 않습니다." });
    }

    //delete도 사용가능 하나 destroy는 해당 레코드를 직접 삭제하는 메소드 sequelize에서는 destroy를 사용하는 것이 일반적(안전성)
    await post.destroy();

    res.status(200).json({ "message": "게시글 삭제에 성공하였습니다." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버에러가 발생했습니다');
  }
});

module.exports = router;

