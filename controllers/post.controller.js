const PostService = require("../services/post.service.js")
const CustomError = require("../middlewares/errorhandler.js")
const fs = require("fs");

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
            const imagefile = `/postImg/${req.file.filename}`
            await this.PostService.CreatePost({ userId, imagefile, content })
            res.status(200).json({ "message": "게시글 작성에 성공하였습니다." })
        } catch (err) {
            //에러발생 시 사진 업로드 취소
            if (req.file) {
                fs.unlinkSync(__dirname + '/../uploads' + `/postImg/${req.file.filename}`);
            }
            next(err)
        }
    }

    getPost = async (req, res, next) => {
        const { userId } = res.locals.user;
        try {
            const pageInfo = req.query;
            const page = parseInt(pageInfo.page);
            const pageSize = parseInt(pageInfo.pageSize);
            if (!pageInfo || !pageSize) {
                throw new CustomError("쿼리를 입력해주세요 선생님", 410)
            }
            let start = 0;

            if (page <= 0) {
                page = 1;
            } else {
                start = (page - 1) * pageSize;
            }
            const posts = await this.PostService.findLimitPost({ start, pageSize })
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
            await this.PostService.deletePost({ post })
            res.status(200).json({ "message": "게시글 삭제에 성공하였습니다." });
        } catch (err) {
            next(err)
        }
    }


}

module.exports = PostController;