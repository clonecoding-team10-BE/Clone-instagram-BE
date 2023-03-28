const CommentService = require("../services/comment.service.js");

class CommentController {
    constructor() {
        this.CommentService = new CommentService();
    }

    createComment = async(req, res, next) => {
            const { postId } = req.params;
            const { comment } = req.body;
            const { userId, nickname } = res.locals.user;
        try {
            await this.CommentService.createComment({ postId, userId, nickname, comment });
            res.status(200).json({ message: "댓글 작성에 성공하였습니다" });
        } catch(err) {  
            next(err)
        }
    }

    getComment = async(req, res, next) => {
        const { postId } = req.params;
        try {
            const comments = await this.CommentService.getComment({ postId })
            // 해당 게시글의 댓글 조회 나열
            res.status(200).json({ comments : comments });
        } catch(err) {
            next(err)
        }
    }

    deleteComment = async(req, res, next) => {
        const { postId, commentId } = req.params;
        const { userId } = res.locals.user;
        try {
            await this.CommentService.deleteComment({ postId, commentId, userId });
            res.status(200).json({ message: "댓글을 삭제하였습니다." });
        } catch(err) {
            next(err)
        }    
    }


}

module.exports = CommentController;