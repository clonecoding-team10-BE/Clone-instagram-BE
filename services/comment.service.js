const CommentRepository = require("../repositories/comment.repository.js")
const PostRepository = require("../repositories/post.repository.js")
const CustomError = require("../middlewares/errorhandler.js")


class CommentService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.CommentRepository = new CommentRepository();
    }

    createComment = async ({ postId, userId, nickname, comment }) => {
        // 게시글 존재 확인
        const post = await this.PostRepository.CheckPost({ postId })
        //댓글 작성
        await this.CommentRepository.createComment({ postId, userId, nickname, comment })
    }

    getComment = async ({ postId }) => {
        return await this.CommentRepository.getComment({ postId })
    }

    deleteComment = async ({ postId, commentId, userId }) => {
        // 게시글 존재 확인
        await this.PostRepository.CheckPost({ postId })
        //댓글 존재 확인
        const existComment = await this.CommentRepository.checkComment({commentId})
        //댓글 삭제
        await this.CommentRepository.deleteComment({ commentId, userId,existComment })
    }


}

module.exports = CommentService;