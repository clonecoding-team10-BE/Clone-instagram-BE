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
    findByPK = async ({postId}) => {
        return await Posts.findByPk(postId);
    }
    modifyPost = async ({content,post}) => {
        post.content = content;
        await post.save();
    }
}

module.exports = PostRepository;