const router = require('express').Router()
let Log = require('../models/log.model')
let UserSession = require('../models/userSession.model')
let User = require('../models/user.model')

router.route('/in').get((req, res) => {
    const { query } = req
    const { token } = query

    if (!token) {
        return res.send({
            success: false,
            message: 'Error: token cannot be blank.'
        })
    }

    UserSession.find({
        _id: token,
        isDeleted: false
    })
        .then((sessions) => {
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Token.'
                })
            }
            const session = sessions[0]
            User.find({
                _id: session.userId
            })
                .then((users) => {
                    //invalid credentials
                    if (users.length != 1) {
                        return res.send({
                            success: false,
                            message: 'Error: Invalid session user ID.'
                        })
                    }
                    const user = users[0]
                    Log.find({
                        toUsername: user.username
                    }).sort({updatedAt:-1})
                        .then(logs => res.json(logs))
                        .catch(err => res.status(400).json('Error: ' + err))

                })
                .catch(err => res.status(400).json('Error: ' + err))

        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/out').get((req, res) => {
    const { query } = req
    const { token } = query

    if (!token) {
        return res.send({
            success: false,
            message: 'Error: token cannot be blank.'
        })
    }

    UserSession.find({
        _id: token,
        isDeleted: false
    })
        .then((sessions) => {
            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid Token.'
                })
            }
            const session = sessions[0]
            User.find({
                _id: session.userId
            })
                .then((users) => {
                    //invalid credentials
                    if (users.length != 1) {
                        return res.send({
                            success: false,
                            message: 'Error: Invalid session user ID.'
                        })
                    }
                    const user = users[0]
                    Log.find({
                        fromUsername: user.username
                    }).sort({updatedAt:-1})
                        .then(logs => res.json(logs))
                        .catch(err => res.status(400).json('Error: ' + err))

                })
                .catch(err => res.status(400).json('Error: ' + err))

        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/add').post((req, res) => {
    const fromUsername = req.body.fromUsername
    const toUsername = req.body.toUsername
    const content = req.body.content

    if (!fromUsername) {
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
        .then(() => {
            return res.send({
                success: true,
                message: 'Log sent.'
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
    Log.findById(req.params.id)
        .then(log => res.json(log))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/update/:id').post((req, res) => {
    Log.findById(req.params.id)
        .then(log => {
            log.username = req.body.username
            log.content = req.body.content

            log.save()
                .then(() => res.json('Log updated!'))
                .catch(err => res.status(400).json('Error: ' + err))
        })
        .catch(err => res.status(400).json('Error: ' + err))
})

module.exports = router