const { Likes, Posts } = require('../models');

class LikeRepository {
    constructor() { }

    findOneLike = async ({postId, userId}) => {
        return Likes.findOne({ where: { postId: postId, userId: userId } }); 
    }
    createLike = async ({postId, userId}) => {
        await Likes.create(
            { postId: postId, userId: userId, isLike: true }
        );
    }
    destroyLike = async ({postId, userId}) => {
        Likes.destroy(
            { where: { postId: postId, userId: userId } }
        );
    }

}

module.exports = LikeRepository;