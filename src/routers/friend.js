const express = require('express')
const router = new express.Router()

const multer = require('multer')
const Jimp = require('jimp')

const Friend = require('../models/friend')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            cb(new Error('Please upload png or jpg file'))

        cb(undefined, true)
    }
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


router.post('/friends', upload.single('picture'), async(req,res)=>{
    console.log(req.body)
    const friend = new Friend(req.body)
    try{
        if (req.file){
            let img = await Jimp.read(req.file.buffer)
            friend.pictureLeft = await img.quality(8).cover(240,320).crop(0,0,120,320).getBufferAsync(Jimp.MIME_PNG)
            img = await Jimp.read(req.file.buffer)
            friend.pictureRight = await img.quality(8).cover(240,320).crop(120,0,120,320).getBufferAsync(Jimp.MIME_PNG)
             
        } 
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

router.get('/friends/:id/pictureleft', async (req, res)=>{
    try{
        const friend = await Friend.findById(req.params.id)
        console.log(friend)
        if(!friend || !friend.pictureLeft){
            throw new Error('No image found')
        }
        res.set('Content-Type', 'image/png')
        res.send(friend.pictureLeft)
    }catch(e){
        res.status(404).send(e)
    }
})

router.get('/friends/:id/pictureright', async (req, res)=>{
    try{
        const friend = await Friend.findById(req.params.id)
        console.log(friend)
        if(!friend || !friend.pictureRight){
            throw new Error('No image found')
        }
        res.set('Content-Type', 'image/png')
        res.send(friend.pictureRight)
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router