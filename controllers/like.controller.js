const LikeService = require("../services/like.service.js");

class LikeController {
    constructor() {
        this.LikeService = new LikeService();
    }

    updateLike = async (req, res, next) => {
            const { postId } = req.params;
            const { userId } = res.locals.user; // 토큰을 검사하여 해당 회원 확인
        try {
            const isExistPost = await this.LikeService.existPost({postId})

            // 좋아요 유무 따져서 좋아요가 없으면 좋아요 등록, 반대인 경우는 좋아요 취소
            const message = await this.LikeService.updateLike({postId, userId, isExistPost})
            res.status(200).json({ message: message });

        } catch (err) {
          next(err)
        }
    }
}

module.exports = LikeController;