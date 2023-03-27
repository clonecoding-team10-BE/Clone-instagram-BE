const express = require('express')
const router = express.Router()
const CustomError = require("../middlewares/errorhandler.js")
const { Posts, Comments, Users } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 댓글 작성 API 
//localhost:3000/posts/:postId/comments
router.post('/:postId/comments',authMiddleware, async(req, res,next) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body; // 우선은 유저고유번호, 닉네임, 댓글 써야 작성 가능하게 조치
        const { userId, nickname } = res.locals.user;

        // 게시글 존재 확인
        const post = await Posts.findOne({
            where: { postId: postId }
        })
        // 게시글 미존재
        if (!post) {
            throw new CustomError("게시글이 존재하지 않습니다",404)
        }
        // 댓글 미입력
        if (!comment) {
            throw new CustomError("댓글을 입력해주세요",412)
        }
        // 댓글 생성
        await Comments.create({
            postId: postId,
            userId: userId,
            nickname: nickname,
            comment: comment,
        });
        // 댓글 작성 성공
        res.status(200).json({ message: "댓글 작성에 성공하였습니다" });
    } catch(err) {  
        next(err)
    }
});

// 댓글 조회 API
//localhost:3000/posts/:postId/comments
router.get('/:postId/comments',authMiddleware, async(req, res,next) =>{
    try {
        const { postId } = req.params;

        const comments = await Comments.findAll({
            attributes: [
                "commentId",
                "User.email",
                "User.nickname", 
                "comment", 
                "createdAt", 
                "updatedAt",
            ],
            include: [
                {
                    model: Users,
                    attributes: [],
                }
            ],
            where : [{ postId: postId }],
            order: [['createdAt', 'DESC']], // 작성 날짜 기준으로 내림차순
            raw: true, // JSON 형태로 반환된 데이터를 처리
        })
        // 해당 게시글의 댓글 조회 나열
        res.status(200).json({ comments : comments });
    } catch(err) {
        next(err)
    }
});

// 댓글 삭제 API 
//localhost:3000/posts/:postId/comments/:commentId
router.delete("/:postId/comments/:commentId",authMiddleware, async(req, res,next) => {
    try {
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;
        // 게시글 존재 확인
        const post = await Posts.findOne({
            where: { postId: postId }
        });
        // 게시글이 존재하지 않는 경우
        if (!post) {
            throw new CustomError("게시글이 존재하지 않습니다",404)
        }
        // 댓글을 조회합니다.
        const existComment = await Comments.findOne({ where: { commentId: commentId } });
        if (!existComment) {
            throw new CustomError("댓글이 존재하지 않습니다",404)
        }
        // 로그인한 회원의 유저 아이디와 댓글 작성한 회원 아이디가 다른 경우
        if (existComment.userId !== userId)  {
            throw new CustomError("댓글 삭제의 권한이 존재하지 않습니다",403)
        }
        // 댓글의 권한을 확인하고, 댓글을 삭제합니다.
        await Comments.destroy(
            { where: { commentId: commentId } }
        );
        res.status(200).json({ message: "댓글을 삭제하였습니다." });
    } catch(err) {
        next(err)
    }
});

module.exports = router;