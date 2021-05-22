const express = require('express')

const multer = require('multer')
const checkAuth = require('../middleware/check-auth')
const {
    boards_get_all,
    board_delete_board,
    boards_get_board,
    board_delete_all,
    board_patch_board,
    board_post_board
} = require('../controller/board')
const router = express.Router()

const storage = multer.diskStorage(
    {
        destination : function(req, file, cb){
            cb(null, './uploads')
        },
        filename : function(req, file, cb){
            cb(null, file.originalname)
        }
    }
)

const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null, false)
    }
}

const upload = multer(
    {
        storage : storage,
        limit : {
            filesize : 1024*1024*5
        },
        fileFilter : fileFilter
    }
)

// total get board
router.get('/', boards_get_all)

// detail get board
router.get('/:boardId', checkAuth, boards_get_board)

// register board
router.post('/', checkAuth, upload.single('boardImage'), board_post_board)

// update board
router.patch('/:boardId', checkAuth, board_patch_board)

// total delete board
router.delete('/', checkAuth, board_delete_board)

// detail delete board
router.delete('/:boardId', checkAuth, board_delete_board)

module.exports = router