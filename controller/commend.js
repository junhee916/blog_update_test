const commendModel = require('../model/commend')

exports.commends_get_commend = async (req, res) => {

    const id = req.params.commendId

    try{
        const commend = await commendModel.findById(id)
            .populate('user', ['email'])
            .populate('board', ['contents'])

        if(!commend){
            return res.status(402).json({
                msg : "no commend id"
            })
        }
        else{
            res.json({
                msg : "get commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    board : commend.board,
                    commend : commend.commend,
                    date : commend.createdAt
                }
            })
        }

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.commend_post_commend = async (req, res) => {

    const {user, board, commend} = req.body

    const newCommend = new commendModel(
        {
            user, board, commend
        }
    )
    try{
        const commend = await newCommend.save()

        res.json({
            msg : "register commend",
            commendInfo : {
                id : commend._id,
                user : commend.user,
                board : commend.board,
                commend : commend.commend,
                date : commend.createdAt
            }
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.commend_update_commend = async (req, res) => {

    const id = req.params.commendId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{
        const commend = await commendModel.findByIdAndUpdate(id, {$set : updateOps})
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.commend_delete_all = async (req, res) => {

    try{
        await commendModel.remove()

        res.json({
            msg : "delete commends"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

exports.commend_delete_commend = async (req, res) => {

    const id = req.params.commendId

    try{
        const commend = await commendModel.findByIdAndRemove(id)
        if(!commend){
            return res.status(402).json({
                msg : "no commend id"
            })
        }
        else{
            res.json({
                msg : "delete commend by " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

