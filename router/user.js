const express = require('express')
const userModel = require('../model/user')
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

// total get user
router.get('/', async (req, res) => {

    try{
        const users = await userModel.find()

        res.json({
            msg : "get users",
            count : users.length,
            userInfo : users.map(user => {
                return{
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password,
                    rule : user.rule,
                    profileImage : user.profileImage
                }
            })
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail get user
router.get('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findById(id)

        if(!user){
            res.status(402).json({
                mgs : "no user id"
            })
        }
        else{
            res.json({
                msg : "get user",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password,
                    rule : user.rule,
                    profileImage: user.profileImage
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// sign up
router.post('/signup', async (req, res) => {

    const {name, email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password
            })

            await user.save()

            res.json({
                msg : "sign user",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password,
                    rule : user.rule,
                    profileImage : user.profileImage
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// login
router.post('/login', async (req, res) => {

    const {email, password} = req.body

    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{

            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(401).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {expiresIn: '1h'}
                    )

                    res.json({token})
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
} )

// total delete user
router.delete('/', async (req, res) => {

    try{
        await userModel.remove()

        res.json({
            msg : "delete users"
        })
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

// detail delete user
router.delete('/:userId', checkAuth, async (req, res) => {

    const id = req.params.userId

    try{
        const user = await userModel.findByIdAndRemove(id)
        if(!user){
            res.status(402).json({
                msg : "no user id"
            })
        }
        else{
            res.json({
                msg : "delete user by " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
})

module.exports = router