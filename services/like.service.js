const LikeRepository = require("../repositories/like.repository")
const PostRepository = require("../repositories/post.repository.js")

class LikeService {
    constructor() {
        this.LikeRepository = new LikeRepository();
        this.PostRepository = new PostRepository();
    }
    existPost = async ({postId}) => {
        return await this.PostRepository.CheckPost({postId}) // 게시글 있는지 확인
    }

    updateLike = async ({postId, userId, isExistPost}) => {  
        // postId와 userId 검색
        const isLiked = await this.LikeRepository.findOneLike({postId, userId})
        // 좋아요 유무 확인 후 좋아요가 없으면, 좋아요 생성, 그 반대는 좋아요 삭제    
        console.log(isExistPost.likecount)
        if (!isLiked) {
            const like = isExistPost.likecount + 1;
            await this.LikeRepository.createLike({postId, userId})
            await this.PostRepository.likeUpdate({like,postId})
            let message = "좋아요 등록에 성공하였습니다."
            return message;
        } else {
            const like = isExistPost.likecount - 1;
            await this.LikeRepository.destroyLike({postId, userId})
            await this.PostRepository.likeUpdate({like,postId})
            let message = "좋아요 취소에 성공하였습니다."
            return message;
        }
    }


}

module.exports = LikeService;