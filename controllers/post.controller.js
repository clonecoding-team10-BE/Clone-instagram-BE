const PostService = require("../services/post.service.js")
const CustomError = require("../middlewares/errorhandler.js")

class PostController {
    constructor() {
        this.PostService = new PostService();
    }

    CreatePost = async (req, res, next) => {
        const { userId } = res.locals.user;
        const { content } = req.body;
        try {
            if (!req.file) {
                throw new CustomError("이미지를 업로드해주세요", 410)
            } else if (!content) {
                throw new CustomError("게시글을 작성해주세요", 410)
            }
            const imagefile = req.file.filename
            await this.PostService.CreatePost({ userId, imagefile , content })
            res.status(200).json({ "message": "게시글 작성에 성공하였습니다." })
        } catch (err) {
            next(err)
        }
    }

    getPost = async (req, res, next) => {
        const { userId } = res.locals.user;
        try {
            const posts = await this.PostService.findAllPost()
            const postList = await this.PostService.mapPost({ posts, userId })

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
            const post = await this.PostService.checkPost({ postId, userId })
            await this.PostService.modifyPost({ content, post })
            res.status(200).json({ "message": "게시글이 성공적으로 수정되었습니다." });
        } catch (err) {
            next(err)
        }
    }

    deletePost = async (req, res) => {
        const { postId } = req.params;
        const { userId } = res.locals.user;

        try {
            const post = await this.PostService.checkPost({ postId, userId })
            
            //delete도 사용가능 하나 destroy는 해당 레코드를 직접 삭제하는 메소드 sequelize에서는 destroy를 사용하는 것이 일반적(안전성)
            await this.PostService.deletePost({post})
            res.status(200).json({ "message": "게시글 삭제에 성공하였습니다." });
        } catch (err) {
            next(err)
        }
    }


}

module.exports = PostController;