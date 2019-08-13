const router = require('express').Router()
let Log = require('../models/log.model')

router.route('/').get((req,res)=>{
    Log.find()
        .then(logs=>res.json(logs))
        .catch(err=>res.status(400).json('Error: '+err))
})

router.route('/add').post((req,res)=>{
    const username = req.body.username
    const content = req.body.content

    const newLog = new Log({
        username,
        content
    })

    newLog.save()
        .then(()=>res.json('Log added!'))
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