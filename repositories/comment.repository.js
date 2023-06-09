const { Comments, Users } = require("../models");
const CustomError = require("../middlewares/errorhandler.js")

class CommentRepository {
    constructor() { }

    createComment = async ({ postId, userId, nickname, comment }) => {
        // 댓글 미입력 시
        if (!comment) {
            throw new CustomError("댓글을 입력해주세요", 412)
        }
        // 댓글 생성
        await Comments.create({
            postId: postId,
            userId: userId,
            nickname: nickname,
            comment: comment,
        });
    }

    getComment = async ({ postId }) => {
        return await Comments.findAll({
            attributes: [
                "commentId",
                "User.nickname",
                "User.profileImg",
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
            where: [{ postId: postId }],
            order: [['createdAt', 'DESC']], // 작성 날짜 기준으로 내림차순
            raw: true, // JSON 형태로 반환된 데이터를 처리
        })
    }
    getLimitComment = async ({ postId }) => {
        return await Comments.findAll({
            attributes: [
                "commentId",
                "postId",
                "User.nickname",
                "User.profileImg",
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
            where: [{ postId: postId }],
            order: [['createdAt', 'DESC']], // 작성 날짜 기준으로 내림차순
            limit : 3,
            raw: true, // JSON 형태로 반환된 데이터를 처리
        })
    }
    checkComment = async ({ commentId }) => {
        // 댓글을 조회합니다.
        const existComment = await Comments.findOne({ where: { commentId: commentId } });
        if (!existComment) {
            throw new CustomError("댓글이 존재하지 않습니다", 404)
        }
        return existComment
    }

    deleteComment = async ({ commentId, userId, existComment }) => {
        // 로그인한 회원의 유저 아이디와 댓글 작성한 회원 아이디가 다른 경우
        if (existComment.userId !== userId) {
            throw new CustomError("댓글 삭제의 권한이 존재하지 않습니다", 403)
        }
        // 댓글의 권한을 확인하고, 댓글을 삭제합니다.
        await Comments.destroy(
            { where: { commentId: commentId } }
        );
    }
}

module.exports = CommentRepository;