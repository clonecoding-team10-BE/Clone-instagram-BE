const PostRepository = require("../repositories/post.repository.js")
const CommentRepository = require("../repositories/comment.repository.js")
const LikeRepository = require("../repositories/like.repository.js")

const CustomError = require("../middlewares/errorhandler.js")

class PostService {
    constructor() {
        this.PostRepository = new PostRepository();
        this.CommentRepository = new CommentRepository();
        this.LikeRepository = new LikeRepository();
    }

    CreatePost = async ({ userId, imagefile, content }) => {
        await this.PostRepository.CreatePost({ userId, imagefile, content })
    }

    modifyPost = async ({ content, post }) => {
        if (!content) {
            throw new CustomError("수정할 게시글을 입력해주세요", 410)
        }
        //수정업데이트
        await this.PostRepository.modifyPost({ content, post })
    }
    checkPost = async ({ postId, userId }) => {
        const post = await this.PostRepository.CheckPost({ postId })
        // findBuPk()는 sequelize에서 제공하는 메서드 PrimaryKey에 해당하는 값을 찾아 반환(postId값에 해당하는 게시물 조회)
        if (post.userId !== userId) {
            throw new CustomError("게시글의 권한이 존재하지 않습니다", 403)
        }
        return post;
    }
    findLimitPost = async ({start,pageSize}) => {
        return await this.PostRepository.findLimitPost({start,pageSize})
    }

    mapPost = async ({ posts, userId }) => {
        return await Promise.all(posts.map(async (post) => {
            const postId = post.postId
            //postId에 해당하는 comment도 같이 response
            const comments = await this.CommentRepository.getLimitComment({postId})

            //isLike가 존재하지않을때 -> 좋아요를 누르지 않았을 때
            //isLike 값을 강제로 false 반환
            let isLike;
            const like = await this.LikeRepository.findOneLike({ userId, postId })
            // console.log(likes)
            if (!like) {
                isLike = false
            } else {
                isLike = true
            }
            return {
                "postId": post.postId,
                "nickname": post.nickname,
                "img": post.img,
                "profileImg" : post.profileImg,
                "content": post.content,
                "likeCount": post.likeCount,
                "isLike": isLike,
                "createdAt": post.createdAt,
                "updatedAt": post.updatedAt,
                "comment": comments
            }
        }))
    }
    deletePost = async ({ post }) => {
        await this.PostRepository.deleltePost({ post })
    }


}

module.exports = PostService;