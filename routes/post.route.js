const express = require('express')
const { Posts, Likes, Users, Comments } = require("../models")
const authmiddleware = require("../middlewares/auth-middleware.js")
const router = express.Router()

//게시글 작성
//localhost:3000/posts POST
router.post("/", authmiddleware, async (req, res) => {
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
router.get("/", authmiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const posts = await Posts.findAll({
        raw: true,
        attributes: ["postId", "User.nickname", "img", "content", "likeCount", "Likes.isLike", "createdAt", "updatedAt"],
        order: [['postId', 'DESC']], //최신순 정렬
        include: [{
            model: Users,
            attributes: []
        }, {
            model: Likes,
            attributes: [],
            where: { userId }
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

        if (post.isLike === null) {
            post.isLike = false
        } else {
            post.isLike = true
        }
        // console.log(post.isLike)
        return {
            "postId": post.postId,
            "nickname": post.nickname,
            "img": post.img,
            "content": post.content,
            "likeCount": post.likeCount,
            "isLike": post.isLike,
            "createdAt": post.createdAt,
            "updatedAt": post.updatedAt,
            "comment": comments
        }
    }))

    res.status(200).json({ postList })
})

module.exports = router;