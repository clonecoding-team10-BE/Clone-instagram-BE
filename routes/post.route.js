const express = require('express')
const { Posts } = require("../models")
const router = express.Router()

//게시글 작성
//localhost:3000/posts POST
router.post("/", async (req, res) => {
    const { img, comtent } = req.body;
    await Posts.create({ img, comtent })
    res.status(200).json({ "message": "게시글 작성에 성공하였습니다." })
})

//게시글 전체 조회
//localhost:3000/posts GET
router.get("/", async (req, res) => {

    const posts = await Posts.findAll({
        raw: true,
        attributes: ['postId', 'User.account', "User.nickname", "img", "content", "likeCount", "createdAt", "updatedAt"],
        order: [['postId', 'DESC']],
        include: [{
            model: Users,
            attributes: []
        }]
    })
    res.status(200).json({ posts })
})

module.exports = router;