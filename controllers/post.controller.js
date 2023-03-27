const PostService = require("../services/post.service.js")
const CustomError = require("../middlewares/errorhandler.js")

class PostController {
    constructor() {
        this.PostService = new PostService();
    }

    CreatePost = async (req, res, next) => {
        const { userId } = res.locals.user;
        const { img, content } = req.body;
        try {
            if (!req.body.hasOwnProperty('img')) {
                throw new CustomError("이미지를 업로드해주세요", 410)
            } else if (!req.body.hasOwnProperty('content')) {
                throw new CustomError("게시글을 작성해주세요", 410)
            }
            await this.PostService.CreatePost({ userId, img, content })
            res.status(200).json({ "message": "게시글 작성에 성공하였습니다." })
        } catch (err) {
            next(err)
        }
    }

    getPost = async (req, res, next) => {
        const { userId } = res.locals.user;
        try {
            const posts = await Posts.findAll({
                raw: true,
                attributes: ["postId", "User.nickname", "img", "content", "likeCount", "createdAt", "updatedAt"],
                order: [['postId', 'DESC']], //최신순 정렬
                include: [{
                    model: Users,
                    attributes: []
                }]
            })

            const postList = await Promise.all(posts.map(async (post) => {
                const postId = post.postId
                //postId에 해당하는 comment도 같이 response
                const comments = await Comments.findAll({
                    where: { postId },
                    order: [['commentId', 'DESC']], //최신순 정렬
                })

                //isLike가 존재하지않을때 -> 좋아요를 누르지 않았을 때
                //isLike 값을 강제로 false 반환
                const likes = await Likes.findOne({
                    where: { userId, postId }
                })
                // console.log(likes)
                if (!likes) {
                    isLike = false
                } else {
                    isLike = true
                }

                return {
                    "postId": post.postId,
                    "nickname": post.nickname,
                    "img": post.img,
                    "content": post.content,
                    "likeCount": post.likeCount,
                    "isLike": isLike,
                    "createdAt": post.createdAt,
                    "updatedAt": post.updatedAt,
                    "comment": comments
                }
            }))

            res.status(200).json({ postList })
        } catch (err) {
            next(err)
        }

    }

    modifyPost = async (req, res, next) => {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const { content } = req.body;
        try {
            const post  = await this.PostService.checkPost({ postId, userId })
            await this.PostService.modifyPost({ content,post })
            res.status(200).json({ "message": "게시글이 성공적으로 수정되었습니다." });
        } catch (err) {
            next(err)
        }
    }


}

module.exports = PostController;