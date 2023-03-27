const { Posts, Likes, Users, Comments } = require("../models")

class PostRepository {
    constructor() { }

    CreatePost = async ({ userId, img, content }) => {
        await Posts.create({
            userId,
            img,
            content
        })
    }
    findByPK = async ({ postId }) => {
        return await Posts.findByPk(postId);
    }
    modifyPost = async ({ content, post }) => {
        post.content = content;
        await post.save();
    }
    findAllPost = async () => {
        return await Posts.findAll({
            raw: true,
            attributes: ["postId", "User.nickname", "img", "content", "likeCount", "createdAt", "updatedAt"],
            order: [['postId', 'DESC']], //최신순 정렬
            include: [{
                model: Users,
                attributes: []
            }]
        })
    }
    findAllComment = async ({ postId }) => {
        return await Comments.findAll({
            where: { postId },
            order: [['commentId', 'DESC']], //최신순 정렬
        })
    }
    findOneLike = async ({ userId, postId }) => {
        return await Likes.findOne({
            where: { userId, postId }
        })
    }
    deleltePost = async ({ post }) => {
        await post.destroy();
    }
}

module.exports = PostRepository;