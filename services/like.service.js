const LikeRepository = require("../repositories/like.repository")
const CustomError = require("../middlewares/errorhandler.js")

class LikeService {
    constructor() {
        this.LikeRepository = new LikeRepository();
    }
    existPost = async ({postId}) => {
        const isExistPost = await this.LikeRepository.existPost({postId}); // 게시글 있는지 확인
        // 게시글 없을 때
        if (!isExistPost) {
            throw new CustomError("게시글이 존재하지 않습니다", 400)
        }
        return isExistPost;
    }

    updateLike = async ({postId, userId, isExistPost}) => {  
        // postId와 userId 검색
        const isLiked = await this.LikeRepository.findOneLike({postId, userId})
        // 좋아요 유무 확인 후 좋아요가 없으면, 좋아요 생성, 그 반대는 좋아요 삭제    
        if (!isLiked) {
            const likes = isExistPost.likecount + 1;
            await this.LikeRepository.createLike({postId, userId})
            await this.LikeRepository.updatePostLike({likes,postId})
            let message = "좋아요 등록에 성공하였습니다."
            return message;
        } else {
            const likes = isExistPost.likecount - 1;
            await this.LikeRepository.destroyLike({postId, userId})
            await this.LikeRepository.updatePostLike({likes,postId})
            let message = "좋아요 취소에 성공하였습니다."
            return message;
        }
    }


}

module.exports = LikeService;