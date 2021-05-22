const express = require('express')

const checkAuth = require('../middleware/check-auth')
const {
    commends_get_commend,
    commend_delete_all,
    commend_delete_commend,
    commend_post_commend,
    commend_update_commend
} = require('../controller/commend')
const router = express.Router()

// detail get commend
router.get('/:commendId', checkAuth, commends_get_commend)

// register commend
router.post('/', checkAuth, commend_post_commend)

// update commend
router.patch('/:commedId', checkAuth, commend_update_commend)

// total delete commend
router.delete('/', checkAuth, commend_delete_all)

// detail delete commend
router.delete('/:commendId', checkAuth, commend_delete_commend)

module.exports = router