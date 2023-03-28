const { Likes, Posts } = require('../models');

class LikeRepository {
    constructor() { }

    existPost = async ({postId}) => {
        console.log(postId)
        return await Posts.findOne({where : {postId}});
    }

    findOneLike = async ({postId, userId}) => {
        return Likes.findOne({ where: { postId: postId, userId: userId } }); 
    }
    createLike = async ({postId, userId}) => {
        await Likes.create(
            { postId: postId, userId: userId, isLike: true }
        );
    }
    updatePostLike = async ({likes,postId}) => {
        await Posts.update(
            { likecount: likes },
            { where: { postId: postId } }
        )
    }
    destroyLike = async ({postId, userId}) => {
        Likes.destroy(
            { where: { postId: postId, userId: userId } }
        );
    }

}

module.exports = LikeRepository;