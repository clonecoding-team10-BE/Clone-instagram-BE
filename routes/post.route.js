const express = require('express')
const multer = require('multer')
var path = require('path');
const authMiddleware = require("../middlewares/auth-middleware.js")
const PostController = require("../controllers/post.controller.js")
const postcontroller = new PostController();
const router = express.Router()

//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/postImg/')  //uploads라는 폴더에 저장할꺼다
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
})
const fileFilter = (req, file, cb) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];

    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
        req.fileValidationError = null;
        cb(null, true);
    } else {
        req.fileValidationError = "jpg,jpeg,png파일만 업로드 가능합니다.";
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

//게시글 작성
//localhost:3000/posts POST
router.post("/", authMiddleware,upload.single('img'), postcontroller.CreatePost)

//게시글 전체 조회
//localhost:3000/posts GET
router.get("/", authMiddleware, postcontroller.getPost)

// 게시글 수정 
//localhost:3000/posts/:postId PUT
router.put('/:postId', authMiddleware, postcontroller.modifyPost);

// 게시글 삭제
//localhost:3000/posts/:postId DELETE
router.delete('/:postId', authMiddleware, postcontroller.deletePost);

module.exports = router;

