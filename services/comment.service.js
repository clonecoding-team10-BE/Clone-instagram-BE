const CommentRepository = require("../repositories/comment.repository.js")

class CommentService {
    constructor() {
        this.CommentRepository = new CommentRepository();
    }

    createComment = async ({ postId, userId, nickname, comment }) => {
        await this.CommentRepository.createComment({ postId, userId, nickname, comment })
    }

    getComment = async ({ postId }) => {
        return await this.CommentRepository.getComment({ postId })
    }
    
    deleteComment = async ({ postId, commentId, userId }) => {
        await this.CommentRepository.deleteComment({ postId, commentId, userId })
    }


}

module.exports = CommentService;