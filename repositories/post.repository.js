const { Posts, Users } = require("../models")

class PostRepository {
    constructor() { }

    CreatePost = async ({ userId, imagefile, content }) => {
        await Posts.create({
            userId,
            img : imagefile,
            content
        })
    }
    CheckPost = async ({ postId }) => {
        const post = await Posts.findByPk(postId);
        if (!post) {
            throw new CustomError("게시글이 존재하지 않습니다", 404)
        }
        return post;
    }
    modifyPost = async ({ content, post }) => {
        post.content = content;
        await post.save();
    }
    findAllPost = async () => {
        return await Posts.findAll({
            raw: true,
            attributes: ["postId", "User.nickname","User.profileImg" ,"img", "content", "likeCount", "createdAt", "updatedAt"],
            order: [['postId', 'DESC']], //최신순 정렬
            include: [{
                model: Users,
                attributes: []
            }]
        })
    }
    
    deleltePost = async ({ post }) => {
        await post.destroy();
    }

    likeUpdate = async ({like,postId}) => {
        await Posts.update(
            { likecount: like },
            { where: { postId: postId } }
        )
    }
}

module.exports = PostRepository;