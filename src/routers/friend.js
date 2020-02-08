const express = require('express')
const router = new express.Router()

const multer = require('multer')

const Friend = require('../models/friend')

const upload = multer({
    dest: 'public/Assets/avatars'
})


router.get('/friends', async (req, res) =>{
    try{
        const friends = await Friend.find({})
        res.send(friends)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/friends/:id', async(req, res)=>{
    const _id = req.params.id
    try{
        const friend = await Friend.findById(_id)
        if(!friend)
            res.status(404).send()
        res.send(friend)
    }catch(e){
        res.status(500).send(e)
    }
})


router.post('/friends', async(req,res)=>{
    console.log(req.body)
    const friend = new Friend(req.body)
    try{
        await friend.save()
        res.status(201).send(friend)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.patch('/friends/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstname', 'lastname', 'stand']
    updatesValid = updates.every(update=>allowedUpdates.includes(update))

    if(!updatesValid)
        res.status(400).send('Error: Invalid Updates!')

    try{
        const friend = await Friend.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!friend)
            res.status(404).send()
        res.send(friend)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/friends/avatar', upload.single('avatar'), (req, res)=>{
    res.send()
})

module.exports = router