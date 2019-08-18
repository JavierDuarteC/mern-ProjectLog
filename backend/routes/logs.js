const router = require('express').Router()
let Log = require('../models/log.model')

router.route('/').get((req,res)=>{
    Log.find()
        .then(logs=>res.json(logs))
        .catch(err=>res.status(400).json('Error: '+err))
})

router.route('/add').post((req,res)=>{
    const fromUsername = req.body.fromUsername
    const toUsername = req.body.toUsername
    const content = req.body.content

    if(!fromUsername){
        return res.send({
            success: false,
            message: 'From username cannot be blank.'
        })
    }

    if (!toUsername) {
        return res.send({
            success: false,
            message: 'To username cannot be blank.'
        })
    }

    if (!content) {
        return res.send({
            success: false,
            message: 'Content cannot be blank.'
        })
    }

    const newLog = new Log({
        fromUsername,
        toUsername,
        content
    })

    newLog.save()
        .then(()=>{
            return res.send({
                success: true,
                message: 'Log sent.'
            })
        })
        .catch(err=>res.status(400).json('Error: '+err))
})

router.route('/:id').get((req,res)=>{
    Log.findById(req.params.id)
        .then(log=>res.json(log))
        .catch(err=>res.status(400).json('Error: '+err))
})

router.route('/update/:id').post((req,res)=>{
    Log.findById(req.params.id)
        .then(log=>{
            log.username = req.body.username
            log.content = req.body.content

            log.save()
                .then(()=>res.json('Log updated!'))
                .catch(err=>res.status(400).json('Error: '+err))
        })
        .catch(err=>res.status(400).json('Error: '+err))
})

module.exports = router