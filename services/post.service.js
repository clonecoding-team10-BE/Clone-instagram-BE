const PostRepository = require("../repositories/post.repository.js")
const CustomError = require("../middlewares/errorhandler.js")

class PostService {
    constructor() {
        this.PostRepository = new PostRepository();
    }

    CreatePost = async ({ userId, img, content }) => {
        await this.PostRepository.CreatePost({ userId, img, content })
    }

    modifyPost = async ({content,post}) => {
        if (!content) {
            throw new CustomError("수정할 게시글을 입력해주세요", 410)
        }
        //수정업데이트
        await this.PostRepository.modifyPost({content,post})
    }
    checkPost = async ({postId,userId}) => {
        const post = await this.PostRepository.findByPK({postId})
        // findBuPk()는 sequelize에서 제공하는 메서드 PrimaryKey에 해당하는 값을 찾아 반환(postId값에 해당하는 게시물 조회)
        if (!post) {
            throw new CustomError("게시글이 존재하지 않습니다", 404)
        }
        if (post.userId !== userId) {
            throw new CustomError("게시글의 수정 권한이 존재하지 않습니다", 403)
        }
        return post;
    }
}

module.exports = PostService;